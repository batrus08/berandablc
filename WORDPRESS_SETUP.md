# WordPress setup – Headless feed untuk React app

Gunakan panduan ini untuk memastikan data WordPress dapat dikonsumsi stabil oleh aplikasi React headless.

## Endpoint yang dipakai
- Artikel DBS: `GET /wp-json/wp/v2/posts?slug=<slug>&_embed=1` dan listing dengan `_embed=1` serta filter kategori slug `dbs`.
- Agenda (Custom Post Type): `GET /wp-json/wp/v2/agenda?slug=<slug>&_embed=1` dan listing dengan `_embed=1`.
- Kategori: `GET /wp-json/wp/v2/categories?slug=dbs` digunakan untuk mendapatkan ID kategori DBS sebelum menarik artikel.

## Instalasi plugin Agenda
1. Buat arsip ZIP dari folder `wordpress-plugin/blc-agenda-cpt` atau salin folder tersebut ke instalasi WordPress Anda pada direktori `wp-content/plugins/`.
2. Aktifkan plugin **BLC Agenda CPT** melalui menu **Plugins**.
3. Buka **Settings → Permalinks** dan simpan kembali (Save/Regenerate) agar struktur `/agenda` aktif.

## Konten Agenda
- Pastikan Custom Post Type `agenda` aktif dan REST API diizinkan (`show_in_rest` = true).
- Endpoint utama: `/wp-json/wp/v2/agenda` (otomatis menambahkan `_embed=1` untuk featured media).
- Bidang penting:
  - **Title**, **Content**, dan **Excerpt** digunakan langsung di UI.
  - **Featured image** opsional; placeholder akan digunakan bila kosong.
  - **Meta fields** (semua tersedia di REST API):
    - `start_date` (contoh: `2024-05-12`)
    - `end_date` (opsional, contoh: `2024-05-13`)
    - `time` (contoh: `19:00 - 21:00`)
    - `location` (contoh: `Auditorium FH UI`)
    - `register_url` (contoh: `https://contoh.com/daftar`)

## Konten Artikel DBS
- Gunakan post type bawaan `post`.
- Pastikan pos berada pada kategori dengan **slug `dbs`** agar muncul di daftar artikel.
- Bidang penting:
  - **Title** dan **Content** diisi lengkap.
  - **Excerpt** diisi (jika kosong WordPress akan mengisi otomatis, tetapi lebih baik diset manual untuk ringkasan bersih).
  - **Featured image** disarankan untuk memastikan thumbnail tidak jatuh ke placeholder.

## Environment
Salin `.env.example` menjadi `.env` lalu set:

```bash
VITE_WP_BASE_URL=https://wp-anda.example
```

Pastikan domain tersebut mengizinkan permintaan dari origin front-end (CORS) atau letakkan front-end pada domain yang sama.
