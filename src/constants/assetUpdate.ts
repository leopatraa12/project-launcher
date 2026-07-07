// Cloudflare R2 public bucket serving manifest.json at its root.
// See docs/manifest.template.json / docs/manifest.template.README.md for the upload format.
export const MANIFEST_URL = "https://cdn.kuylah.online/manifest.json";

export interface ManifestPackage {
  name: string;
  version: string;
  url: string;
  sha256: string;
  size: number;
  // Relative to modloader/Kuyland inside the GTA:SA folder; "" = root.
  installDirectory: string;
}

export interface Manifest {
  packages: ManifestPackage[];
}

export type InstalledPackagesState = Record<
  string,
  { version: string; sha256: string }
>;

// Sibling to the existing "samp"/"omp" folders under appLocalDataDir.
export const ASSET_LOCAL_DIR = "assets";
export const INSTALLED_STATE_FILE = "installed.json";
export const DOWNLOADS_SUBDIR = "downloads";
export const MODLOADER_KUYLAND_SEGMENTS = ["modloader", "Kuyland"];

export const MAX_DOWNLOAD_RETRIES = 2;

// PRD: loading screen duration is simulated UX, not tied to real work.
export const LOADING_SCREEN_MIN_MS = 2000;
export const LOADING_SCREEN_MAX_MS = 5000;
