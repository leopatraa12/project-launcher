# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The open.mp launcher: a Tauri (Rust) + React Native Web desktop app for Windows that lists SA-MP/open.mp
servers, lets users join them, and launches/injects the game client. The frontend is written with
React Native primitives (`View`, `StyleSheet`, etc. via `react-native-web`), not plain HTML/CSS.

## Commands

- `yarn start` — run the app in dev mode (`tauri dev`, launches Vite + the Rust backend together)
- `yarn dev` / `yarn dev-ingame` — Vite dev server only (`--ompdebug` / `--ompdebug --ingame` flags)
- `yarn build` / `yarn build-ingame` — typecheck (`tsc`) + production Vite build (`--omprelease`)
- `yarn release` — full Tauri release build targeting `i686-pc-windows-msvc` (game is 32-bit)
- `yarn installer` — build the NSIS installer manually from `src-tauri/nsis/installer_manual.nsi`
- Rust only: `cargo check` / `cargo build` from `src-tauri/` (target must be `i686-pc-windows-msvc`;
  see `src-tauri/rust-toolchain.toml` for the pinned nightly — required for `dll-syringe` compatibility)
- No test suite is currently configured for either the frontend or the Rust backend.

CI (`.github/workflows/build.yml`) builds on `windows-latest` with the pinned nightly Rust toolchain and
uploads the NSIS/MSI bundles as artifacts on pushes to `master`/`main`.

## Architecture

### Process split

The app is a Tauri shell: a Rust backend (`src-tauri/src/`) exposes `#[tauri::command]` functions that
the React frontend (`src/`) calls via `invoke(...)`. All commands are registered in the
`tauri::generate_handler!` list in [main.rs](src-tauri/src/main.rs). When adding a new native
capability, add the function in the relevant `src-tauri/src/*.rs` module, wire it into that handler
list, and call it from the frontend with `invoke("command_name", { ... })`.

Rust module responsibilities:
- `main.rs` — app bootstrap, CLI-arg handling (deep-link/`omp://`/`samp://` URIs and direct
  command-line game launches bypass the UI entirely), window setup, deep-link registration (Windows only)
- `cli.rs` — CLI argument parsing (`gumdrop`) for headless/deeplink launch mode
- `commands.rs` — most `invoke()`-able commands (inject, checksum, file copy, admin re-run, logging)
- `injector.rs` — spawns the GTA:SA process and DLL-injects `samp.dll`/`omp-client.dll` via
  `dll-syringe`, with retry logic that waits for the game's audio (vorbis) module to load first
  before completing injection
- `query.rs` — UDP server-query protocol implementation (SA-MP/open.mp query packets), with an
  in-process rate limiter and a short-lived query cache
- `ipc.rs` — a raw TCP listener (`IPC_PORT`, see `constants.rs`) used for the in-game overlay: the
  injected DLL talks back to the launcher process over this socket to manage overlay windows
  (`omp_overlay_window:<pid>`) and forward messages like `connect:`/`close_overlay`
- `samp.rs` — reads legacy SA-MP client state (registry/config) such as GTA:SA path and saved nickname
- `helpers.rs` — misc utilities incl. `resolve_hostname_to_ipv4` (hostnames are pre-resolved to IPv4
  before being handed to the game, since the game truncates hyphenated hostnames) and recursive file copy
- `validation.rs` / `errors.rs` — input validation and the shared `LauncherError` / `Result` type
- `deeplink/` — Windows-only custom URI scheme (`omp://`, `samp://`) registration/handling

### "In-game" mode

The same compiled binary runs in two modes, distinguished by a `?attached_id=<pid>` query param on
`index.html` (see [constants/app.ts](src/constants/app.ts)):
- **Normal mode** (`IN_GAME = false`): the full launcher UI — server browser, settings, etc.
- **In-game overlay mode** (`IN_GAME = true`): a borderless overlay window spawned by the Rust side
  (`ipc.rs::create_overlay_window`) and injected alongside the game, used for in-game UI (e.g. join
  prompts) while GTA:SA is running. It talks to the main launcher process via the TCP IPC channel
  rather than Tauri's normal single-process APIs. Code throughout `src/` branches on `IN_GAME`
  /`IN_GAME_PROCESS_ID` to change behavior (e.g. [utils/game.ts](src/utils/game.ts) `startGame`
  sends an IPC `connect:` message instead of injecting when already in-game).

### Frontend structure

- `containers/` — feature-level screens/panels (MainBody server list, Settings, modals, context menu,
  etc.), composed together in [App.tsx](src/App.tsx) as lazily-loaded chunks
- `components/` — small reusable UI primitives (buttons, dropdowns, tabs, modals)
- `states/` — Zustand stores, split into ephemeral stores (e.g. `servers.ts`'s `useServers`) and
  persistent stores (`persist` middleware backed by `utils/stateStorage.ts`, currently just
  `localStorage`). Persistent servers/settings stores broadcast changes across windows (main window
  vs. in-game overlay window) using Tauri's `emit`/`listen` events, filtered by `windowLabel`, then
  call `.persist.rehydrate()` in the other window — this is the sync mechanism between the two
  windows since they don't share JS state.
- `api/` — `axios` client (`config.ts`) and typed calls (`apis.ts`) to the open.mp master server list
  API (`/servers/full`, `/launcher` for update info)
- `utils/query.ts` / `states/servers.ts` — client-side server querying flow: `queryServer()` invokes
  the Rust `query_server` command per server to get live ping/player-count/rules data
- `utils/game.ts` — the core "join server" flow: validates GTA:SA path/nickname, ensures required
  SA-MP resource files exist in the game dir (copying them from app-local data if missing, via
  `checkResourceFilesAvailability`/`copySharedFilesIntoGameFolder`), resolves the correct `samp.dll`
  version for the selected `sampVersion` (see `constants/app.ts`'s `validFileChecksums`), then calls
  the Rust `inject` command (or sends an IPC `connect:` message if already in-game)
  - `sampVersion: "custom"` bypasses managed SA-MP DLLs entirely and expects the user's game folder
    to already have its own `samp.dll` and (optionally) a `customGameExe`
- `locales/translations/` — one file per language for `i18next`; add new UI strings here across all
  locale files (or at minimum `en.ts`) when adding user-facing text

### React Native Web quirks

This is a React Native codebase compiled for web via `react-native-web` (see the `vite.config.ts`
alias and Babel plugin setup). Use `View`/`Text`/`StyleSheet.create(...)` and RN styling conventions
(no CSS files, no `className`), not DOM elements — existing components in `components/`/`containers/`
are the reference for idiomatic patterns here.

### Window chrome

The Tauri window itself is undecorated/transparent (`decorations: false, transparent: true` in
`tauri.conf.json`); [WindowTitleBar.tsx](src/containers/WindowTitleBar.tsx) implements the custom
title bar, and rounded corners/shadow are drawn in `App.tsx`'s own styles rather than by the OS.
