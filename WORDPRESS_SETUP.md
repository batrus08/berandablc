# WordPress Setup (Theme + Agenda CPT)

Panduan singkat ini untuk menjalankan Beranda BLC secara penuh di WordPress.

## Komponen
- Theme: `wp-content/themes/blc-theme`
- Plugin: `wordpress-plugin/blc-agenda-cpt`

## Langkah setup

1. **Install theme**
   - Salin `wp-content/themes/blc-theme` ke direktori theme WordPress.
   - Aktifkan theme di **Appearance → Themes**.

2. **Install plugin agenda**
   - Salin `wordpress-plugin/blc-agenda-cpt` ke direktori plugin WordPress.
   - Aktifkan **BLC Agenda CPT** di **Plugins**.
   - Simpan ulang **Settings → Permalinks**.

3. **Atur homepage statis**
   - Buat halaman untuk beranda.
   - Buka **Settings → Reading**.
   - Pilih **A static page** lalu set halaman beranda tadi sebagai **Homepage**.

## Input agenda dari admin

Buka **Agenda → Add New**, lalu isi:
- Judul, konten, excerpt
- Featured image (opsional)
- Meta box detail agenda:
  - `start_date` (wajib, `YYYY-MM-DD`)
  - `end_date` (opsional)
  - `time` (opsional)
  - `location` (opsional)
  - `register_url` (opsional)
  - `minutes_attachment_id` & `report_attachment_id` (opsional)

## Perilaku section Kegiatan Mendatang

Theme akan mengambil otomatis 3 agenda terdekat dari CPT dengan filter:
- post status publish
- `start_date >= hari ini`
- urut naik berdasarkan `start_date`

Jika plugin tidak aktif atau belum ada agenda upcoming, section tetap aman dan menampilkan fallback tanpa fatal error.
