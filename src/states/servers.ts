import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { stateStorage } from "../utils/stateStorage";
import { PerServerSettings, SAMPDLLVersions, Server } from "../utils/types";

interface ServersState {
  selected?: Server;
  setSelected: (server?: Server) => void;
  updateServer: (server: Server) => void;
}

interface ServersPersistentState {
  perServerSettings: PerServerSettings[];
  setServerSettings: (
    server: Server,
    nickname?: string,
    version?: SAMPDLLVersions
  ) => void;
  getServerSettings: (server: Server) => PerServerSettings | undefined;
}

const useServers = create<ServersState>()((set) => ({
  selected: undefined,
  setSelected: (server) => set({ selected: server }),
  updateServer: (server) => set({ selected: server }),
}));

const usePersistentServers = create<ServersPersistentState>()(
  persist(
    (set, get) => ({
      perServerSettings: [],

      setServerSettings: (server, nickname, version) =>
        set(() => {
          const ipPort = `${server.ip}:${server.port}`;
          const updated = [...get().perServerSettings];
          const index = updated.findIndex((s) => s.ipPort === ipPort);

          const newSetting = { ipPort, nickname, sampVersion: version };

          if (index !== -1) updated[index] = newSetting;
          else updated.push(newSetting);

          return { perServerSettings: updated };
        }),

      getServerSettings: (server) =>
        get().perServerSettings.find(
          (s) => s.ipPort === `${server.ip}:${server.port}`
        ),
    }),
    {
      name: "server-settings-storage",
      storage: createJSONStorage(() => stateStorage),
    }
  )
);

export { usePersistentServers, useServers };
