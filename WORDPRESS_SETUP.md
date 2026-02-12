# WordPress setup – Headless feed untuk React app (compatible shared hosting)

Panduan ini memastikan website dapat dikendalikan **satu pintu dari CMS WordPress**, berjalan di instalasi WordPress biasa, dan cocok untuk environment shared hosting.

## Arsitektur yang direkomendasikan (single CMS)
- WordPress menjadi sumber konten utama (single source of truth).
- Front-end React hanya membaca data lewat REST API WordPress.
- Tidak ada kebutuhan server Node di shared hosting saat production: cukup upload hasil `npm run build` ke folder publik (mis. `public_html/app/`) atau embed dari tema.

## Struktur konten yang dipakai
Agar bagian-bagian berikut mudah dikelola via CMS WordPress:

1. **Tentang Kami**
   - Gunakan `Pages` dengan slug default `tentang-kami`.
2. **Kontak**
   - Gunakan `Pages` dengan slug default `kontak`.
3. **Artikel**
   - Gunakan `Posts` pada kategori slug `dbs`.
4. **Kegiatan**
   - Gunakan `Posts` pada kategori slug default `kegiatan`.
5. **Kerjasama**
   - Gunakan `Posts` pada kategori slug default `kerjasama`.
6. **Galeri**
   - Gunakan `Posts` pada kategori slug default `galeri` (upload image/gallery lewat editor WordPress).
7. **Agenda**
   - Gunakan CPT `agenda` (plugin BLC Agenda CPT) agar field tanggal/lokasi terstruktur.

## Endpoint REST yang digunakan
- Halaman statis:
  - `GET /wp-json/wp/v2/pages?slug=<slug>`
- Post listing per kategori:
  - `GET /wp-json/wp/v2/posts?_embed=1&categories=<category_id>`
- Detail post:
  - `GET /wp-json/wp/v2/posts?slug=<slug>&_embed=1`
- Agenda listing/detail:
  - `GET /wp-json/wp/v2/agenda?...&_embed=1`
- Kategori resolver:
  - `GET /wp-json/wp/v2/categories?slug=<slug>`

## Environment
Salin `.env.example` menjadi `.env` lalu sesuaikan:

```bash
VITE_WP_BASE_URL=https://wp-anda.example
VITE_WP_PAGE_ABOUT_SLUG=tentang-kami
VITE_WP_PAGE_CONTACT_SLUG=kontak
VITE_WP_CATEGORY_KEGIATAN_SLUG=kegiatan
VITE_WP_CATEGORY_KERJASAMA_SLUG=kerjasama
VITE_WP_CATEGORY_GALERI_SLUG=galeri
```


## Workflow Admin Friendly (Upload / Edit / Update / Hapus)
Semua konten operasional kini dipusatkan di CMS WordPress, sehingga admin tidak perlu menyunting kode tema.

### 1) Upload konten
- **Artikel/Kegiatan/Kerjasama/Galeri**: masuk ke **Posts** lalu pilih kategori yang sesuai (`dbs`, `kegiatan`, `kerjasama`, `galeri`).
- **Tentang Kami/Kontak**: kelola di **Pages** dengan slug yang dikonfigurasi.
- **Agenda**: kelola di menu **Agenda** (CPT) agar tanggal/lokasi terstruktur.
- Gunakan **Featured Image** dan media uploader WordPress untuk gambar/file.

### 2) Edit & Update konten
- Perubahan judul, isi, gambar, kategori, dan metadata agenda dilakukan dari editor WordPress.
- Front-end menarik data dari REST API/CPT, jadi perubahan otomatis tersinkron tanpa deploy ulang kode.
- Section beranda (hero, highlights, quick access, statistik, sumber agenda, CTA) diatur dari menu **Beranda BLC** di admin.

### 3) Hapus konten
- Hapus dari Posts/Pages/Agenda sesuai jenis konten.
- Konten yang dihapus otomatis tidak tampil lagi di front-end karena sumber tunggal dari CMS.

### 4) Antisipasi tumpang tindih data
- Gunakan 1 kategori utama per konten agar tidak dobel muncul lintas section.
- Untuk section kegiatan beranda, aktifkan sumber **Agenda CPT** dari pengaturan Beranda BLC agar daftar agenda konsisten dan tidak bentrok dengan data manual.

## Instalasi plugin Agenda
1. Buat ZIP dari `wordpress-plugin/blc-agenda-cpt` atau salin ke `wp-content/plugins/`.
2. Aktifkan plugin **BLC Agenda CPT** di menu Plugins.
3. Buka **Settings → Permalinks** lalu klik Save agar endpoint `/agenda` aktif.

## Catatan kompatibilitas shared hosting
- Pastikan WordPress versi 6+ dan PHP 8+ (minimum direkomendasikan).
- Pastikan permalink menggunakan `Post name`.
- Jika front-end beda domain/subdomain, aktifkan CORS yang sesuai.
- Bila tidak ada akses shell di hosting, build front-end dilakukan lokal lalu upload folder `dist/` via File Manager/FTP.
