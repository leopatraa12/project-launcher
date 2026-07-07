# Self-hosting the launcher's "update available" check

This file replaces open.mp's own `https://api.open.mp/launcher` endpoint, which is what the
"⚠ New Update Available" notice in Settings → General currently checks against.

`src/api/config.ts`'s `BASE_URL` and `src/api/apis.ts`'s `getUpdateInfo()` now request
`<BASE_URL>/launcher-update.json` — host `launcher-update.template.json` (filled in) at that exact
path on your own domain, then set `BASE_URL` to it.

**Use a custom domain, not a shared `pub-*.r2.dev` URL** — see the note already left in
`src/api/config.ts` about ISP-level DNS blocking of the shared `r2.dev` platform domain.

## Filling in the fields

- `version` — the build number the "current" update targets. This launcher's build version is
  `BUILD_VERSION` in `src/constants/app.ts` (currently `"7"`, a simple incrementing string — not the
  same as the `1.7.0` semver in `package.json`/`Cargo.toml`). Bump this (and add a matching entry
  under `versions`) every time you cut a new launcher release.
- `download` — direct URL to the new installer (`.exe`) for the *latest* version. Shown when a
  player's version doesn't match `version` — clicking the notice opens this link.
- `changelog` — currently unused by any UI in this app (left over from upstream open.mp), but keep
  it filled in for future use.
- `versions` — a map keyed by build-version string. The app looks up
  `versions[<the player's currently-installed BUILD_VERSION>]` to decide which `download`/OMP-plugin
  info applies to them specifically (falls back to `versions[version]`, i.e. latest, if their exact
  version isn't listed). Keep at least one entry matching the current `BUILD_VERSION`.

## Important: `ompPluginChecksum` / `ompPluginDownload` are a separate concern

These two fields are **not** about the launcher app itself — they're the MD5 checksum and download
URL for `omp-client.dll`, the open.mp game-injection plugin that's still required for joining
open.mp servers, downloaded and verified by `LoadingScreen.tsx` on every app boot. Unless you've
compiled your own fork of that plugin, leave `ompPluginDownload` pointing at open.mp's official CDN
(`https://assets.open.mp/omp-client.dll`) and set `ompPluginChecksum` to the real MD5 of that exact
file (`certutil -hashfile omp-client.dll MD5` after downloading it once). Getting this wrong won't
affect the update notice, but will break game injection for every player.
