import api from "../api/config";
import { UpdateInfo } from "../states/app";
import { Log } from "../utils/logger";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const getUpdateInfo = async (): Promise<
  ApiResponse<UpdateInfo | undefined>
> => {
  try {
    const response = await api.get<UpdateInfo>("/launcher", { timeout: 5000 });
    return { success: true, data: response.data };
  } catch (error) {
    Log.debug("Failed to fetch update info:", error);
    return {
      success: false,
      data: undefined,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
