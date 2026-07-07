import { invoke, shell } from "@tauri-apps/api";
import { getVersion } from "@tauri-apps/api/app";
import { type } from "@tauri-apps/api/os";
import { t } from "i18next";
import { getUpdateInfo } from "../api/apis";
import { useAppState } from "../states/app";
import { useMessageBox } from "../states/messageModal";
import { Log } from "./logger";
import { SAMPDLLVersions, SAMP_DLL_VERSIONS } from "./types";
import { validateServerAddressIPv4 } from "./validation";

export const fetchUpdateInfo = async () => {
  const { version } = useAppState.getState();

  const nativeVer = await getVersion();
  const hostOS = await type();
  const response = await getUpdateInfo();
  if (response.data) {
    const versionInfo = response.data.versions[useAppState.getState().version];

    if (versionInfo) {
      response.data.download = versionInfo.download;
      response.data.ompPluginChecksum = versionInfo.ompPluginChecksum;
      response.data.ompPluginDownload = versionInfo.ompPluginDownload;
    } else {
      const info = response.data.versions[response.data.version];
      if (info) {
        response.data.download = info.download;
        response.data.ompPluginChecksum = info.ompPluginChecksum;
        response.data.ompPluginDownload = info.ompPluginDownload;
      }
    }

    useAppState.getState().setUpdateInfo(response.data);
    useAppState.getState().setNativeAppVersionValue(nativeVer);
    useAppState.getState().setHostOSValue(hostOS);
  }

  setTimeout(async () => {
    const { updateInfo, skipUpdate, skippedUpdateVersion } =
      useAppState.getState();
    const { showMessageBox, hideMessageBox } = useMessageBox.getState();

    if (updateInfo) {
      if (
        updateInfo.version != version &&
        skippedUpdateVersion != updateInfo.version
      ) {
        showMessageBox({
          title: t("update_modal_update_available_title"),
          description: t("update_modal_update_available_description", {
            version,
            newVersion: updateInfo.version,
          }),
          boxWidth: 640,
          buttonWidth: 200,
          buttons: [
            {
              title: t("download"),
              onPress: () => {
                shell.open(updateInfo.download);
                hideMessageBox();
              },
            },
            {
              title: t("update_modal_remind_me_next_time"),
              onPress: () => {
                hideMessageBox();
              },
            },
            {
              title: t("update_modal_skip_this_update"),
              onPress: () => {
                skipUpdate(updateInfo.version);
                hideMessageBox();
              },
            },
          ],
        });
      } else {
        Log.info("No new update available");
      }
    }
  }, 1000);
  Log.debug(response);
};

// Validation functions are now imported from ./validation.ts
// This provides better separation of concerns and reusability

export const getIpAddress = async (
  hostname: string
): Promise<string | null> => {
  if (!hostname || typeof hostname !== "string") {
    Log.warn("Invalid hostname provided to getIpAddress:", hostname);
    return null;
  }

  // Use validation function from validation.ts
  if (validateServerAddressIPv4(hostname)) {
    return hostname;
  }

  try {
    const ip = await invoke<string>("resolve_hostname", { hostname });
    Log.debug(`Resolved ${hostname} to ${ip}`);
    return ip;
  } catch (error) {
    Log.error("Failed to resolve hostname:", error);
    return null;
  }
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  if (bytes < 0) return "Invalid";

  const k = 1024;
  const sizes = [
    "Bytes",
    "KB",
    "MB",
    "GB",
    "TB",
    "PB",
    "EB",
    "ZB",
    "YB",
  ] as const;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  if (i >= sizes.length) return "Too Large";

  const value = bytes / Math.pow(k, i);
  return `${parseFloat(value.toFixed(decimals))} ${sizes[i]}`;
};

export const getSampVersions = (): readonly SAMPDLLVersions[] => {
  return [...SAMP_DLL_VERSIONS];
};

const VERSION_NAME_MAP: Record<SAMPDLLVersions, string | (() => string)> = {
  "037R1_samp.dll": "0.3.7-R1",
  "037R2_samp.dll": "0.3.7-R2",
  "037R3_samp.dll": "0.3.7-R3",
  "037R31_samp.dll": "0.3.7-R3-1",
  "037R4_samp.dll": "0.3.7-R4",
  "037R5_samp.dll": "0.3.7-R5",
  "03DL_samp.dll": "0.3.DL",
  custom: () => t("from_gtasa_folder"),
};

export const getSampVersionName = (version: SAMPDLLVersions): string => {
  const nameOrFunction = VERSION_NAME_MAP[version];
  return typeof nameOrFunction === "function"
    ? nameOrFunction()
    : nameOrFunction;
};

export const getSampVersionFromName = (name: string): SAMPDLLVersions => {
  if (!name) return "custom";

  const versions = getSampVersions();
  for (const version of versions) {
    if (getSampVersionName(version) === name) {
      return version;
    }
  }

  return "custom";
};

export const checkIfProcessAlive = async (pid: number): Promise<boolean> => {
  if (!pid || pid <= 0) {
    Log.warn("Invalid PID provided to checkIfProcessAlive:", pid);
    return false;
  }

  try {
    const alive = await invoke<boolean>("is_process_alive", { pid });
    Log.debug(`PID ${pid} alive: ${alive}`);
    return alive;
  } catch (error) {
    Log.error("Failed to check process:", error);
    return false;
  }
};
