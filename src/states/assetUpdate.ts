import { create } from "zustand";

export type AssetUpdateStage =
  | "idle"
  | "checking_manifest"
  | "downloading"
  | "verifying"
  | "extracting"
  | "loading_screen";

interface DownloadProgress {
  size: number;
  total: number;
  percent: number;
  bytesPerSecond: number;
  etaSeconds: number;
}

interface AssetUpdateState {
  visible: boolean;
  stage: AssetUpdateStage;
  currentPackageName: string;
  packageIndex: number;
  packageCount: number;
  progress: DownloadProgress;
  loadingPercent: number;
  show: () => void;
  hide: () => void;
  setStage: (stage: AssetUpdateStage) => void;
  setCurrentPackage: (name: string, index: number, count: number) => void;
  setProgress: (progress: DownloadProgress) => void;
  setLoadingPercent: (percent: number) => void;
  reset: () => void;
}

const INITIAL_PROGRESS: DownloadProgress = {
  size: 0,
  total: 0,
  percent: 0,
  bytesPerSecond: 0,
  etaSeconds: 0,
};

const useAssetUpdate = create<AssetUpdateState>()((set) => ({
  visible: false,
  stage: "idle",
  currentPackageName: "",
  packageIndex: 0,
  packageCount: 0,
  progress: INITIAL_PROGRESS,
  loadingPercent: 0,
  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
  setStage: (stage) => set({ stage }),
  setCurrentPackage: (name, index, count) =>
    set({ currentPackageName: name, packageIndex: index, packageCount: count }),
  setProgress: (progress) => set({ progress }),
  setLoadingPercent: (loadingPercent) => set({ loadingPercent }),
  reset: () =>
    set({
      stage: "idle",
      currentPackageName: "",
      packageIndex: 0,
      packageCount: 0,
      progress: INITIAL_PROGRESS,
      loadingPercent: 0,
    }),
}));

export { useAssetUpdate };
export type { DownloadProgress };
