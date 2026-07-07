import { Server, ServerIdentifier } from "../utils/types";

// TODO: swap these before release with the real Kuyland Remastered server address.
export const KUYLAND_SERVER: ServerIdentifier = {
  ip: "51.79.184.109",
  port: 7777,
};

export const SERVER_NAME = "Kuyland Remastered";
export const SERVER_TAGLINE = "Dedicated Roleplay Launcher";
export const SERVER_DESCRIPTION =
  "The official Kuyland Remastered experience — jump in and play.";

export const createInitialKuylandServer = (): Server => ({
  ip: KUYLAND_SERVER.ip,
  port: KUYLAND_SERVER.port,
  hostname: SERVER_NAME,
  playerCount: 0,
  maxPlayers: 0,
  gameMode: "-",
  language: "-",
  hasPassword: false,
  version: "-",
  usingOmp: false,
  partner: false,
  // Duplicated literal instead of importing PING_TIMEOUT_VALUE from utils/query.ts,
  // which avoids a query.ts -> server.ts -> query.ts import cycle.
  ping: 9999,
  players: [],
  password: "",
  rules: {} as Server["rules"],
});
