# VirtualLab-Olahraga

Repositori ini berisi Virtual Sports Lab bertema simulasi latihan kardiovaskular. Aplikasi ini dibangun untuk membantu mahasiswa olahraga memahami bagaimana detak jantung merespon perubahan intensitas latihan, sekaligus menyediakan materi pembelajaran seputar pencegahan cedera dan kebugaran.

## Konten

- **Frontend**: React 18 + TypeScript, Vite, TailwindCSS, dan ikon Lucide. Tampilan utama mencakup laboratorium virtual, Learning Center, serta halaman profil.
- **Backend**: Node.js + Express dengan MongoDB (via Mongoose) sebagai penyimpanan pengguna dan hasil simulasi. Simulasi detak jantung dijalankan di server menggunakan model fisika sederhana.
- **Autentikasi**: Email + password menggunakan JWT. Password disimpan dengan bcrypt.
- **Simulasi**: Tiga tingkat intensitas (rest, jog, sprint) dengan transisi realtime yang dikirimkan ke frontend.
- **Learning Center**: Modul edukasi yang menjelaskan pilar-pilar pencegahan cedera dan kebugaran.

## Framework & Library

- **React 18** – membangun antarmuka berbasis komponen.
- **Vite** – dev server dan bundler yang cepat untuk React + TypeScript.
- **Tailwind CSS** – styling utility-first yang memudahkan penyesuaian tampilan.
- **Express.js** – kerangka kerja backend untuk REST API.
- **MongoDB + Mongoose** – penyimpanan data pengguna dan hasil simulasi.
- **jsonwebtoken & bcryptjs** – autentikasi JWT dan hashing password.

## Menjalankan Secara Lokal

### 1. Persiapan Umum

Pastikan Node.js (versi 18 ke atas) dan npm sudah terpasang. Kloning repositori ini lalu masuk ke folder proyek.

```bash
git clone <url-repo-anda>
cd VirtualLab-Olahraga
```

### 2. Menjalankan Backend

```bash
cd backend
npm install
```

Buat berkas `.env` di folder `backend` dengan isi minimal:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
JWT_SECRET=isi_dengan_string_acak
PORT=5000 # opsional, default 5000
```

Kemudian jalankan server backend:

```bash
npm start
```

Jika berhasil, server akan berjalan di `http://localhost:5000`.

### 3. Menjalankan Frontend

```bash
cd ../frontend
npm install
```

Buat `.env` di folder `frontend`:

```
VITE_API_URL=http://localhost:5000/api
```

Lalu jalankan Vite dev server:

```bash
npm run dev
```

Frontend dapat diakses melalui URL yang ditampilkan (biasanya `http://localhost:5173`).

## Opsi Deploy

- **Backend**: bisa didorong ke Railway, Render, atau layanan Node.js lainnya. Pastikan variabel lingkungan (`MONGODB_URI`, `JWT_SECRET`, `PORT`) dikonfigurasi di sana.
- **Frontend**: dapat di-deploy ke Vercel. Setelah proses build otomatis, atur `VITE_API_URL` melalui pengaturan environment di Vercel agar mengarah ke endpoint backend yang sudah Anda host.

> **Catatan**: Website dapat diakses pada link berikut : https://virtual-lab-olahraga-69ml.vercel.app/

## Struktur Direktori Singkat

```
backend/   # kode server Express + simulasi
frontend/  # aplikasi React + halaman Learning Center
```

Semoga membantu Anda memahami dan menjalankan Virtual Sports Lab ini. Selamat bereksperimen!
