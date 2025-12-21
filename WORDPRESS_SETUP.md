# WordPress setup – Headless feed untuk React app

Gunakan panduan ini untuk memastikan data WordPress dapat dikonsumsi stabil oleh aplikasi React headless.

## Endpoint yang dipakai
- Artikel DBS: `GET /wp-json/wp/v2/posts?slug=<slug>&_embed=1` dan listing dengan `_embed=1` serta filter kategori slug `dbs`.
- Agenda (Custom Post Type): `GET /wp-json/wp/v2/agenda?slug=<slug>&_embed=1` dan listing dengan `_embed=1`.
- Kategori: `GET /wp-json/wp/v2/categories?slug=dbs` digunakan untuk mendapatkan ID kategori DBS sebelum menarik artikel.

## Konten Artikel DBS
- Gunakan post type bawaan `post`.
- Pastikan pos berada pada kategori dengan **slug `dbs`** agar muncul di daftar artikel.
- Bidang penting:
  - **Title** dan **Content** diisi lengkap.
  - **Excerpt** diisi (jika kosong WordPress akan mengisi otomatis, tetapi lebih baik diset manual untuk ringkasan bersih).
  - **Featured image** disarankan untuk memastikan thumbnail tidak jatuh ke placeholder.

## Konten Agenda
- Pastikan Custom Post Type `agenda` aktif dan REST API diizinkan (`show_in_rest` = true).
- Endpoint utama: `/wp-json/wp/v2/agenda` (otomatis menambahkan `_embed=1` untuk featured media).
- Bidang penting:
  - **Title**, **Content**, dan **Excerpt** digunakan langsung di UI.
  - **Featured image** opsional; placeholder akan digunakan bila kosong.
  - Gunakan tanggal publikasi (`date`) sebagai referensi penjadwalan/urutan.

## Meta/ACF (opsional)
Saat ini aplikasi hanya memakai data inti WP (judul, excerpt, konten, featured image). Jika menambahkan ACF/meta tambahan, pastikan:
- Field disertakan dalam REST API response (aktifkan opsi `show_in_rest`).
- Jaga struktur respons agar tidak merusak penormalan data di `src/services/contentService.ts`.

## Environment
Salin `.env.example` menjadi `.env` lalu set:

```bash
VITE_WP_BASE_URL=https://wp-anda.example
```

Pastikan domain tersebut mengizinkan permintaan dari origin front-end (CORS) atau letakkan front-end pada domain yang sama.
