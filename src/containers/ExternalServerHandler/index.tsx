import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { useJoinServerPrompt } from "../../states/joinServerPrompt";
import { useServers } from "../../states/servers";
import { Log } from "../../utils/logger";

// This launcher only ever connects to one hardcoded server, so a received
// `omp://`/`samp://` deep link doesn't add a new server or carry its own
// address anywhere — it just opens the join prompt for the one server we have.
const ExternalServerHandler = () => {
  useEffect(() => {
    const openJoinPrompt = () => {
      const server = useServers.getState().selected;
      if (!server) return;

      const { showPrompt, setServer } = useJoinServerPrompt.getState();
      setServer(server);
      showPrompt(true);
    };

    try {
      (async () => {
        const value = await invoke<string>("get_uri_scheme_value");
        if (
          value.length &&
          (value.includes("omp://") || value.includes("samp://"))
        ) {
          openJoinPrompt();
        }
      })();
    } catch (e) {
      Log.error(e);
    }

    const unlisten = listen<string>("scheme-request-received", (event) => {
      if (typeof event.payload === "string") {
        if (
          event.payload.includes("omp://") ||
          event.payload.includes("samp://")
        ) {
          openJoinPrompt();
        }
      }
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return null;
};

export default ExternalServerHandler;
