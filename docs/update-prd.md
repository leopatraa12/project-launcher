# Product Requirement Document (PRD)
# Kuyland Remastered Launcher
## Asset Update System (Manifest + Package Downloader + Loading Experience)

**Versi:** 1.0  
**Status:** Draft  
**Platform:** Windows Desktop (Open.MP Launcher Fork)  
**Teknologi:** React + Tauri + Rust

---

# 1. Latar Belakang

Launcher Kuyland Remastered akan dikembangkan menjadi launcher modern yang mampu melakukan sinkronisasi asset secara otomatis sebelum pemain memasuki game.

Seluruh asset server akan disimpan dalam bentuk package (.zip) yang berada pada Cloudflare R2 Storage.

Launcher akan membaca file manifest.json untuk mengetahui package apa saja yang harus dimiliki oleh pemain.

Apabila terdapat package yang belum dimiliki atau versinya sudah tidak sesuai, launcher akan mengunduh package tersebut secara otomatis, melakukan validasi, mengekstrak isi package ke folder Modloader GTA San Andreas, kemudian melanjutkan proses Launch Game.

Launcher tidak akan langsung menjalankan GTA setelah proses download selesai, melainkan akan menampilkan Loading Screen sinematik sebagai bagian dari pengalaman pengguna (User Experience).

---

# 2. Tujuan

Membangun sistem Asset Management modern yang mampu:

- Mengurangi proses instalasi manual.
- Menjamin seluruh pemain memiliki asset yang sama.
- Mempermudah update server.
- Mengurangi kesalahan instalasi asset.
- Memberikan pengalaman launcher yang modern dan premium.

---

# 3. Objective

Launcher harus mampu:

- Mengecek manifest secara otomatis.
- Mendeteksi package yang belum terpasang.
- Mendeteksi package yang perlu diperbarui.
- Mengunduh package dari Cloudflare R2.
- Memvalidasi package menggunakan SHA-256.
- Mengekstrak package.
- Memasang asset ke folder Modloader.
- Menghapus file sementara (opsional).
- Menampilkan Loading Screen sebelum GTA dijalankan.
- Menjalankan GTA secara otomatis.
- Auto Connect ke server.

---

# 4. Flow Sistem

```text
Player
      │
      ▼
Klik Tombol PLAY
      │
      ▼
Download Manifest
      │
      ▼
Bandingkan Manifest Lokal
      │
      ▼
Package Berbeda?
      │
 ┌────┴─────┐
 │          │
Ya         Tidak
 │          │
 ▼          ▼
Download     Loading Screen
Package          │
 │               ▼
 ▼          Launch GTA
Verify
 │
 ▼
Extract
 │
 ▼
Install Asset
 │
 ▼
Loading Screen
 │
 ▼
Launch GTA
 │
 ▼
Auto Connect
```

---

# 5. Functional Requirement

## 5.1 Tombol PLAY

Ketika pemain menekan tombol PLAY.

Launcher wajib:

1. Download manifest terbaru.
2. Membandingkan manifest lokal.
3. Menentukan package yang harus di-update.
4. Menjalankan proses update apabila diperlukan.
5. Menampilkan Loading Screen.
6. Launch GTA.
7. Auto Connect ke server.

---

# 5.2 Manifest Downloader

Launcher harus mengunduh:

```
manifest.json
```

melalui URL Cloudflare R2.

Manifest harus selalu diambil dari server.

Launcher tidak boleh menggunakan manifest bawaan.

---

# 5.3 Manifest Checker

Launcher harus membandingkan:

- Version
- SHA256

untuk setiap package.

Apabila terdapat perbedaan.

Launcher wajib memasukkan package tersebut ke Download Queue.

---

# 5.4 Download Manager

Launcher harus mampu:

- Download Package ZIP
- Resume Download (Future)
- Retry Download
- Multi Thread (Future)

Launcher wajib menampilkan:

- Progress Bar
- Download Speed
- Remaining Time
- File Name

---

# 5.5 Package Verification

Setelah download selesai.

Launcher wajib:

- Menghitung SHA256.
- Membandingkan SHA256.
- Menolak package yang rusak.

---

# 5.6 Package Extractor

Launcher harus:

Extract:

```
SkinPack.zip
```

ke:

```
GTA SA/

modloader/

Kuyland/
```

Semua folder wajib dibuat otomatis apabila belum ada.

---

# 5.7 Install Manager

Launcher harus:

- Replace File Lama
- Install File Baru
- Skip File Sama

Launcher tidak boleh menghapus folder Modloader pemain selain folder:

```
modloader/Kuyland
```

---

# 5.8 Loading Screen

Setelah proses download selesai.

Launcher TIDAK langsung menjalankan GTA.

Launcher wajib menampilkan Loading Screen.

Durasi loading bersifat simulasi (UX).

Loading ini bukan proses download.

Melainkan animasi transisi menuju game.

---

# 5.9 Launch GTA

Setelah Loading selesai.

Launcher menjalankan:

```
gta_sa.exe
```

kemudian:

Auto Connect

ke server yang sudah di-hardcode.

---

# 6. User Interface

---

## Download Screen

Menampilkan

- Logo Kuyland
- Judul Download Asset
- Nama Package
- Progress Bar
- Persentase
- Download Speed
- Remaining Time

Contoh

```
Downloading Asset

██████████░░░░░░░

63%

SkinPack.zip

42 MB/s

Remaining 00:18
```

---

## Loading Screen

Loading Screen digunakan hanya untuk meningkatkan pengalaman pengguna.

Tidak ada proses download.

Menampilkan

- Background Image
- Progress Bar
- Persentase
- Tips

Contoh

```
Loading...

███████████████

100%

Preparing Game...
```

Durasi:

2 - 5 detik.

Progress bersifat simulasi.

---

# 7. Struktur Folder Lokal

```
AppData

Local

Kuyland Remastered

│

├── Manifest

│      manifest.json

│

├── Downloads

│      SkinPack.zip

│      MapPack.zip

│

├── Temp

│

├── Logs

│

└── Config
```

---

Folder GTA

```
GTA SA

modloader

Kuyland
```

---

# 8. Struktur Cloudflare R2

```
manifest/

    manifest.json

packages/

    SkinPack.zip

    MapPack.zip

    VehiclePack.zip

    AudioPack.zip

loading/

    loading_background.png
```

---

# 9. Struktur Manifest

Manifest wajib menyimpan:

- Version
- Package Name
- URL
- SHA256
- Size
- Install Directory

---

# 10. Daftar Pekerjaan

## Phase 1

Manifest

- Download Manifest
- Parse JSON
- Compare Version
- Compare SHA256

---

## Phase 2

Download Manager

- Download ZIP
- Retry
- Verify SHA256
- Progress UI

---

## Phase 3

Extractor

- Extract ZIP
- Install Asset
- Replace File
- Cleanup

---

## Phase 4

Loading Screen

- Background Image
- Progress Animation
- Loading Bar
- Fade Animation

---

## Phase 5

Launch Manager

- Launch GTA
- Auto Connect
- Error Handling

---

# 11. Acceptance Criteria

Launcher dianggap selesai apabila:

- Manifest berhasil dibaca.
- Package berhasil dibandingkan.
- Package berhasil di-download.
- SHA256 tervalidasi.
- Package berhasil di-extract.
- Asset berhasil dipasang ke folder Modloader.
- Loading Screen muncul setelah update selesai.
- GTA berjalan otomatis.
- Player langsung masuk ke server.

---

# 12. Future Development

- Differential Patch
- Resume Download
- Parallel Download
- Asset Repair
- Clear Cache
- Launcher Self Update
- Background Video
- Download Pause
- Download Queue Priority