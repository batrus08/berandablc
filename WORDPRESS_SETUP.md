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

## Instalasi plugin Agenda
1. Buat ZIP dari `wordpress-plugin/blc-agenda-cpt` atau salin ke `wp-content/plugins/`.
2. Aktifkan plugin **BLC Agenda CPT** di menu Plugins.
3. Buka **Settings → Permalinks** lalu klik Save agar endpoint `/agenda` aktif.

## Catatan kompatibilitas shared hosting
- Pastikan WordPress versi 6+ dan PHP 8+ (minimum direkomendasikan).
- Pastikan permalink menggunakan `Post name`.
- Jika front-end beda domain/subdomain, aktifkan CORS yang sesuai.
- Bila tidak ada akses shell di hosting, build front-end dilakukan lokal lalu upload folder `dist/` via File Manager/FTP.
