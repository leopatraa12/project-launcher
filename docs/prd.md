# Product Requirement Document (PRD)
# Kuyland Remastered Launcher
## Redesign UI & Single Server Launcher

**Versi:** 1.0  
**Status:** Draft  
**Platform:** Windows Desktop (Open.MP Launcher Fork)  
**Teknologi:** React + Tauri + Rust  
**Bahasa:** Indonesia

---

# 1. Latar Belakang

Launcher Open.MP bawaan dirancang sebagai launcher umum (generic launcher) yang memungkinkan pemain menyimpan banyak alamat server (IP & Port) ke dalam daftar server.

Konsep tersebut kurang sesuai dengan kebutuhan **Kuyland Remastered**, karena launcher akan didistribusikan secara eksklusif hanya untuk server Kuyland Remastered.

Oleh karena itu launcher akan dimodifikasi menjadi launcher khusus (Dedicated Launcher) yang hanya dapat digunakan untuk terhubung ke satu server saja.

Launcher juga akan mendapatkan desain antarmuka (UI/UX) baru dengan tampilan modern, premium, serta menyediakan berbagai informasi server secara real-time.

---

# 2. Tujuan

Membangun launcher khusus Kuyland Remastered yang:

- Memiliki identitas visual resmi server.
- Menghilangkan sistem Multi Server.
- Menggunakan IP & Port yang tertanam (Hardcoded).
- Memberikan pengalaman pengguna yang modern.
- Menjadi pusat informasi server.
- Menjadi fondasi untuk sistem Auto Update Asset pada tahap selanjutnya.

---

# 3. Objective

Launcher harus mampu menjadi satu-satunya media resmi pemain untuk:

- Masuk ke server
- Melihat status server
- Membaca informasi terbaru
- Mengakses komunitas
- Mengakses store
- Mengelola update launcher
- Menjadi pondasi Auto Patch System

---

# 4. Ruang Lingkup

Tahap pertama hanya berfokus pada:

- Redesign UI
- Menghapus fitur Multi Server
- Hardcoded IP & Port
- Integrasi informasi server
- Persiapan sistem Auto Update

Belum termasuk:

- Manifest System
- Asset Downloader
- Patch Manager
- Login Launcher
- Discord Authentication

Semua fitur tersebut akan dikembangkan pada fase berikutnya.

---

# 5. Target Pengguna

- Seluruh pemain Kuyland Remastered
- Admin Server
- Staff Developer

---

# 6. Perubahan Sistem

## Sebelum

Launcher Open.MP

- Add Server
- Edit Server
- Delete Server
- Favorite Server
- Multiple Server List

## Sesudah

Launcher Kuyland Remastered

- Satu Server
- Hardcoded IP
- Hardcoded Port
- Tidak ada daftar server
- Tombol Play langsung menuju server

---

# 7. Kebutuhan UI

## Tema

- Modern
- Premium
- Minimalis
- Gaming Dashboard

---

## Warna

Primary

- Emerald Green

Secondary

- Matte Black

Accent

- White

Status

- Green (Online)
- Red (Offline)
- Orange (Maintenance)

---

## Layout

### Sidebar

Menu Navigasi

- Home
- Server
- Store
- Community
- Settings

Footer

- Discord
- Website
- Instagram

---

### Hero Section

Menampilkan

- Banner Server
- Background Cinematic
- Nama Server
- Deskripsi Server

Button

- PLAY
- CONNECT

---

### User Profile

Menampilkan

- Avatar
- Nama Player
- Level
- XP
- Badge VIP

---

### Server Information

Menampilkan

- Status Server
- Player Online
- Maximum Player
- Ping
- Version
- Voice Status

---

### Community Update

Menampilkan

- Announcement
- Event
- Discord Update
- Maintenance

---

### Featured Store

Menampilkan

- VIP
- Vehicle
- Bundle
- Premium Coin

---

### Quick Access

Shortcut

- Rulebook
- Support
- Statistics
- Changelog

---

# 8. Functional Requirement

## 8.1 Hardcoded Server

Launcher harus memiliki:

- IP Server
- Port Server

yang ditanam langsung ke dalam aplikasi.

Pengguna tidak dapat:

- Menambah Server
- Mengubah IP
- Menghapus Server

---

## 8.2 Tombol PLAY

Saat tombol PLAY ditekan

Launcher akan:

1. Validasi instalasi GTA SA
2. (Tahap berikutnya) Cek Update
3. Launch GTA
4. Auto Connect ke Server

---

## 8.3 Tombol CONNECT

Digunakan untuk:

- Membuka halaman koneksi server
- Menampilkan status koneksi
- Digunakan untuk pengembangan fitur berikutnya

---

## 8.4 Status Server

Launcher harus menampilkan

- Online
- Offline
- Maintenance

Data diperoleh dari Server Query/API.

---

## 8.5 Statistik Server

Launcher menampilkan

- Player Online
- Max Player
- Ping
- Versi Server
- Voice Status

---

## 8.6 Community Update

Menampilkan informasi terbaru

- News
- Event
- Announcement
- Maintenance

Data berasal dari backend.

---

## 8.7 Featured Store

Menampilkan produk unggulan

- VIP
- Vehicle
- Bundle
- Premium Coin

Klik item membuka Website Store.

---

## 8.8 Quick Access

Shortcut menuju

- Discord
- Rulebook
- Website
- Changelog
- Support

---

# 9. Non Functional Requirement

Launcher harus:

- Ringan
- Startup cepat
- Responsif
- Mendukung Dark Theme
- Mendukung resolusi tinggi
- Stabil
- Mudah diperbarui

---

# 10. Persiapan Feature Masa Depan

Launcher harus dirancang agar mudah diintegrasikan dengan:

- Manifest System
- Package Manager
- Patch Manager
- Download Manager
- Auto Update Launcher
- Auto Update Asset
- Video Loading
- Login Launcher
- Discord Login
- Whitelist Validation

---

# 11. Daftar Pekerjaan

## Phase 1 — UI

### Dashboard

- Mendesain ulang Dashboard
- Implementasi Sidebar
- Implementasi Hero Section
- Implementasi Server Information
- Implementasi Community Update
- Implementasi Featured Store
- Implementasi Quick Access

---

### Theme

- Implementasi warna
- Typography
- Icon
- Hover Effect
- Animation

---

## Phase 2 — Single Server Launcher

- Menghapus Add Server
- Menghapus Delete Server
- Menghapus Favorite Server
- Menghapus Edit Server
- Menghapus Multi Server List
- Hardcoded IP
- Hardcoded Port
- Tombol Play langsung Connect

---

## Phase 3 — Backend Integration

- Server Status
- Player Online
- Ping
- Version
- Voice Status
- Community Update
- Store

---

## Phase 4 — Quality Assurance

Pengujian

- Launch GTA
- Auto Connect
- UI Responsiveness
- Server Status
- Community Feed
- Store
- Setting

---

# 12. Acceptance Criteria

Launcher dianggap selesai apabila:

- UI sesuai desain Kuyland Remastered.
- Launcher hanya mendukung satu server.
- Tidak terdapat fitur Add Server.
- Tidak terdapat daftar server.
- Tombol PLAY langsung menjalankan GTA dan menghubungkan ke server yang telah ditentukan.
- Informasi server tampil secara real-time.
- Seluruh menu dapat diakses dengan baik.
- Launcher stabil dan siap dikembangkan untuk sistem Auto Update Asset pada fase berikutnya.

---

# 13. Future Roadmap

## V1

- UI Baru
- Dedicated Launcher
- Hardcoded Server
- Dashboard
- Community
- Store

## V2

- Manifest System
- Package Manager
- Download Manager
- Auto Update Asset
- Patch ZIP
- Progress Download

## V3

- Login Launcher
- Discord Authentication
- Whitelist Validation
- Asset Repair
- Launcher Self Update
- Video Loading Screen
- Background Video
- Patch Notes Dinamis

---

# Penutup

Launcher Kuyland Remastered akan bertransformasi dari launcher Open.MP generik menjadi **Dedicated Game Launcher** yang hanya melayani satu server. Selain menghadirkan identitas visual yang kuat, launcher ini dirancang sebagai fondasi jangka panjang untuk mendukung sistem distribusi asset, pembaruan otomatis, serta integrasi berbagai layanan server di masa mendatang tanpa mengubah arsitektur inti launcher.