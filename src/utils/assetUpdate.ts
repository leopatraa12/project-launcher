import { fs, invoke, path, process, shell } from "@tauri-apps/api";
import { t } from "i18next";
import { download } from "tauri-plugin-upload-api";
import {
  ASSET_LOCAL_DIR,
  DOWNLOADS_SUBDIR,
  INSTALLED_STATE_FILE,
  InstalledPackagesState,
  LOADING_SCREEN_MAX_MS,
  LOADING_SCREEN_MIN_MS,
  MANIFEST_URL,
  MAX_DOWNLOAD_RETRIES,
  Manifest,
  ManifestPackage,
  MODLOADER_KUYLAND_SEGMENTS,
} from "../constants/assetUpdate";
import { useAssetUpdate } from "../states/assetUpdate";
import { useMessageBox } from "../states/messageModal";
import { Log } from "./logger";
import { sc } from "./sizeScaler";

const getAssetLocalPath = async (...segments: string[]) =>
  path.join(await path.appLocalDataDir(), ASSET_LOCAL_DIR, ...segments);

const readInstalledState = async (): Promise<InstalledPackagesState> => {
  try {
    const filePath = await getAssetLocalPath(INSTALLED_STATE_FILE);
    if (!(await fs.exists(filePath))) return {};
    return JSON.parse(await fs.readTextFile(filePath));
  } catch (e) {
    Log.warn("Failed to read installed asset state, treating as empty:", e);
    return {};
  }
};

const writeInstalledState = async (state: InstalledPackagesState) => {
  const dir = await getAssetLocalPath();
  if (!(await fs.exists(dir))) {
    await fs.createDir(dir, { recursive: true });
  }
  await fs.writeFile({
    path: await getAssetLocalPath(INSTALLED_STATE_FILE),
    contents: JSON.stringify(state),
  });
};

const fetchManifest = async (): Promise<Manifest> => {
  // PRD 5.2: must always hit the server, never fall back to a bundled/stale manifest.
  const res = await fetch(MANIFEST_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Manifest fetch failed: ${res.status}`);

  const json = await res.json();
  if (!json || !Array.isArray(json.packages)) {
    throw new Error("Malformed manifest: missing packages array");
  }
  return json as Manifest;
};

const getPackageInstallPath = async (pkg: ManifestPackage, gtasaPath: string) =>
  path.join(
    gtasaPath,
    ...MODLOADER_KUYLAND_SEGMENTS,
    ...(pkg.installDirectory ? [pkg.installDirectory] : [])
  );

const isPackageInstalled = async (
  pkg: ManifestPackage,
  gtasaPath: string,
  installed: InstalledPackagesState
): Promise<boolean> => {
  const local = installed[pkg.name];
  if (
    !local ||
    local.version !== pkg.version ||
    local.sha256.toLowerCase() !== pkg.sha256.toLowerCase()
  ) {
    return false;
  }

  // installed.json alone isn't proof the files are still there (deleted
  // manually, wiped by antivirus, etc.) — check the actual install folder too.
  const installPath = await getPackageInstallPath(pkg, gtasaPath);
  if (!(await fs.exists(installPath))) return false;

  const entries = await fs.readDir(installPath);
  return entries.length > 0;
};

const diffPackages = async (
  manifest: Manifest,
  installed: InstalledPackagesState,
  gtasaPath: string
): Promise<ManifestPackage[]> => {
  const checks = await Promise.all(
    manifest.packages.map(async (pkg) => ({
      pkg,
      installed: await isPackageInstalled(pkg, gtasaPath, installed),
    }))
  );
  return checks.filter((check) => !check.installed).map((check) => check.pkg);
};

const downloadAndInstallPackage = async (
  pkg: ManifestPackage,
  gtasaPath: string
) => {
  const { setStage, setProgress } = useAssetUpdate.getState();
  const zipPath = await getAssetLocalPath(DOWNLOADS_SUBDIR, `${pkg.name}.zip`);
  const downloadsDir = await getAssetLocalPath(DOWNLOADS_SUBDIR);

  if (!(await fs.exists(downloadsDir))) {
    await fs.createDir(downloadsDir, { recursive: true });
  }

  for (let attempt = 1; ; attempt++) {
    setStage("downloading");
    setProgress({ size: 0, total: 0, percent: 0, bytesPerSecond: 0, etaSeconds: 0 });

    await new Promise<void>((resolve) => {
      const startedAt = Date.now();
      let size = 0;

      download(pkg.url, zipPath, (chunk: number, total: number) => {
        size += chunk;
        const elapsedSeconds = (Date.now() - startedAt) / 1000;
        const bytesPerSecond = elapsedSeconds > 0 ? size / elapsedSeconds : 0;
        const percent = total > 0 ? Math.min((size * 100) / total, 100) : 0;
        const etaSeconds =
          bytesPerSecond > 0 ? Math.max((total - size) / bytesPerSecond, 0) : 0;

        setProgress({ size, total, percent, bytesPerSecond, etaSeconds });

        if (size >= total) resolve();
      });
    });

    setStage("verifying");
    const hash: string = await invoke("get_sha256_checksum", { path: zipPath });

    if (hash.toLowerCase() === pkg.sha256.toLowerCase()) break;

    Log.warn(
      `SHA-256 mismatch for package '${pkg.name}' (attempt ${attempt}): expected ${pkg.sha256}, got ${hash}`
    );
    await fs.removeFile(zipPath).catch(() => {});

    if (attempt > MAX_DOWNLOAD_RETRIES) {
      throw new Error(`Checksum verification failed for package '${pkg.name}'`);
    }
  }

  setStage("extracting");
  const outputPath = await getPackageInstallPath(pkg, gtasaPath);

  await invoke("extract_zip", { path: zipPath, outputPath });
  await fs.removeFile(zipPath).catch(() => {});
};

const runSimulatedLoadingScreen = async (): Promise<void> => {
  const { setLoadingPercent } = useAssetUpdate.getState();
  const duration =
    LOADING_SCREEN_MIN_MS +
    Math.random() * (LOADING_SCREEN_MAX_MS - LOADING_SCREEN_MIN_MS);
  const stepMs = 50;
  const steps = Math.max(1, Math.round(duration / stepMs));

  for (let i = 1; i <= steps; i++) {
    await new Promise((resolve) => setTimeout(resolve, stepMs));
    setLoadingPercent(Math.min((i / steps) * 100, 100));
  }
};

const promptRetryOrCancel = (
  title: string,
  description: string
): Promise<"retry" | "cancel"> =>
  new Promise((resolve) => {
    const { showMessageBox, hideMessageBox } = useMessageBox.getState();
    showMessageBox({
      title,
      description,
      buttons: [
        {
          title: t("retry"),
          onPress: () => {
            hideMessageBox();
            resolve("retry");
          },
        },
        {
          title: t("cancel"),
          onPress: () => {
            hideMessageBox();
            resolve("cancel");
          },
        },
      ],
    });
  });

const promptAdminRequired = (): Promise<"cancel"> =>
  new Promise((resolve) => {
    const { showMessageBox, hideMessageBox } = useMessageBox.getState();
    showMessageBox({
      title: t("admin_permissions_required_modal_title"),
      description: t("admin_permissions_required_modal_description"),
      boxWidth: sc(500),
      buttons: [
        {
          title: t("run_as_admin"),
          onPress: () =>
            shell
              .open("https://assets.open.mp/run_as_admin.gif")
              .then(() => process.exit()),
        },
        {
          title: t("cancel"),
          onPress: () => {
            hideMessageBox();
            resolve("cancel");
          },
        },
      ],
    });
  });

export const ensureAssetsUpToDate = async (
  gtasaPath: string
): Promise<"ok" | "cancelled"> => {
  const { show, hide, setStage, setCurrentPackage, reset } =
    useAssetUpdate.getState();
  show();
  reset();

  while (true) {
    try {
      setStage("checking_manifest");
      const manifest = await fetchManifest();
      const installed = await readInstalledState();
      const queue = await diffPackages(manifest, installed, gtasaPath);

      for (let i = 0; i < queue.length; i++) {
        const pkg = queue[i];
        setCurrentPackage(pkg.name, i + 1, queue.length);
        await downloadAndInstallPackage(pkg, gtasaPath);
        installed[pkg.name] = { version: pkg.version, sha256: pkg.sha256 };
        await writeInstalledState(installed);
      }

      setStage("loading_screen");
      await runSimulatedLoadingScreen();
      hide();
      return "ok";
    } catch (e) {
      Log.error("Asset update failed:", e);

      if (e === "need_admin") {
        await promptAdminRequired();
        hide();
        return "cancelled";
      }

      const decision = await promptRetryOrCancel(
        t("asset_update_failed_title"),
        t("asset_update_failed_description")
      );
      if (decision === "cancel") {
        hide();
        return "cancelled";
      }
    }
  }
};
