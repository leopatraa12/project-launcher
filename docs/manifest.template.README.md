# Uploading `manifest.json` to Cloudflare R2

`manifest.template.json` in this folder is a template — it is **not** bundled into the launcher.
Fill it in and upload the real file to your R2 bucket.

## Live buckets (already wired into the app)

Two separate public R2 buckets are in use — `MANIFEST_URL` in `src/constants/assetUpdate.ts` is
already set to the manifest bucket below:

- **Manifest bucket**: `https://pub-96fc86a4b5f64a8da614a5067194014e.r2.dev`
  → upload the filled-in file as `manifest.json` at the bucket root.
- **Packages bucket**: `https://pub-b4fe34d9b6fa4c408448fb34951ec9da.r2.dev`
  → upload each `.zip` at the bucket root (e.g. `SkinPack.zip`), and reference it in
  `manifest.json` as `https://pub-b4fe34d9b6fa4c408448fb34951ec9da.r2.dev/SkinPack.zip`
  (`manifest.template.json` already uses this base URL — just swap the `sha256`/`size` once real
  files are uploaded, and add/remove package entries as needed).

## Filling in each package entry

- `name` — must be unique; used as the local install-tracking key and the downloaded file name
  (`<name>.zip`).
- `version` — any string you bump whenever the package's contents change. The launcher re-downloads
  a package whenever `version` or `sha256` no longer matches what's already installed.
- `url` — the public R2 URL of the `.zip` file.
- `sha256` — lowercase hex SHA-256 of the exact `.zip` file at `url`. On Windows:
  ```
  certutil -hashfile SkinPack.zip SHA256
  ```
  Any mismatch causes the launcher to reject the download and retry.
- `size` — file size in bytes. Currently informational only (not used to gate installation).
- `installDirectory` — relative path under the GTA install's `modloader/Kuyland/` folder where this
  package's contents get extracted. Use `""` to extract straight into `modloader/Kuyland/`, or a
  subfolder name (e.g. `"Vehicles"`) to keep a package's files isolated.

## Notes

- The launcher always fetches `manifest.json` fresh (no caching/fallback) — every PLAY click hits
  this URL, so keep it fast and highly available.
- The `.zip` files must be standard `deflate`-compressed zips (the default for Windows' built-in
  "Compress to zip", 7-Zip, and WinRAR). Zips using `bzip2`/`zstd`/`lzma` compression are not
  currently supported by the launcher's extractor.
