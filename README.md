# Beranda BLC (WordPress-only)

Repository ini difokuskan untuk deployment WordPress, dengan dua komponen utama:

- **Theme**: `wp-content/themes/blc-theme`
- **Plugin Agenda CPT**: `wordpress-plugin/blc-agenda-cpt`

Arsitektur React/Vite dan data statis frontend telah dihapus agar repository bersih untuk kebutuhan runtime WordPress.

## Instalasi

### 1) Install dan aktifkan theme
1. Salin folder `wp-content/themes/blc-theme` ke instalasi WordPress Anda pada `wp-content/themes/`.
2. Aktifkan theme **blc-theme** dari menu **Appearance → Themes**.

### 2) Install dan aktifkan plugin agenda
1. Salin folder `wordpress-plugin/blc-agenda-cpt` ke `wp-content/plugins/`.
2. Aktifkan plugin **BLC Agenda CPT** dari menu **Plugins**.
3. Simpan ulang **Settings → Permalinks** satu kali.

### 3) Set homepage
1. Buat halaman WordPress untuk beranda.
2. Buka **Settings → Reading**.
3. Pilih **A static page** dan set halaman tersebut sebagai **Homepage**.

## Pengelolaan konten beranda

### Beranda BLC (WP Admin)
Menu **Beranda BLC** dipakai untuk mengelola:
- Hero
- Highlight
- Akses Cepat
- CTA
- Sumber blog berita (`news_blog_id`)

### Agenda (satu pintu dari CPT)
Section **Kegiatan Mendatang** di beranda otomatis menarik dari CPT `agenda` dengan aturan:
- hanya post `publish`
- `start_date >= hari ini`
- urutan `start_date` naik
- maksimal 3 item

Jika tidak ada agenda yang cocok, beranda menampilkan fallback: **“Belum ada agenda ditampilkan.”**

## Field agenda yang digunakan
Pada post type `agenda`, isi field berikut sesuai kebutuhan:
- `start_date` (wajib, format `YYYY-MM-DD`)
- `end_date` (opsional)
- `time` (opsional)
- `location` (opsional)
- `register_url` (opsional)
- `minutes_attachment_id` (opsional)
- `report_attachment_id` (opsional)

Judul agenda pada beranda akan mengarah ke detail agenda. Jika `register_url` tersedia, CTA pendaftaran akan ditampilkan.
