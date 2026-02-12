# Beranda BLC – panduan pengelolaan konten

Refactor ini menyajikan ulang berandablc sebagai situs statis modular, data-driven, dan siap di-host di layanan statis (GitHub Pages/Netlify) atau di-embed ke WordPress tanpa build step. Seluruh konten dikendalikan lewat JSON dan aset statis sehingga tim non-teknis dapat memperbarui materi hanya dengan menyunting berkas.

## Headless WordPress + React (experimental)

Folder React/Vite untuk mengonsumsi WordPress REST API berada di akar repo (lihat `src/` yang berisi berkas `.tsx`). Jalankan:

```bash
cp .env.example .env # set VITE_WP_BASE_URL ke instalasi WP
npm install
npm run dev
```

Router mencakup `/artikel`, `/artikel/:slug`, `/agenda`, dan `/agenda/:slug`. Detail integrasi ada di `WORDPRESS_SETUP.md`.

## Kontrol penuh via WordPress CMS (single gate)
Konfigurasi terbaru memastikan section berikut dapat dikendalikan langsung dari dashboard WordPress (compatible shared hosting):
- **Tentang Kami**: WordPress Page (`slug: tentang-kami`)
- **Artikel**: WordPress Posts kategori `dbs`
- **Kegiatan**: WordPress Posts kategori `kegiatan`
- **Kerjasama**: WordPress Posts kategori `kerjasama`
- **Galeri**: WordPress Posts kategori `galeri`
- **Kontak**: WordPress Page (`slug: kontak`)
- **Agenda**: CPT `agenda` (plugin BLC Agenda CPT)

Lihat detail setup di `WORDPRESS_SETUP.md`.

## Fitur utama
- **Tanpa build**: langsung jalankan dari folder `src/` sehingga mudah ditempel di WordPress atau layanan hosting statis.
- **Data-driven**: semua konten hidup di `src/data/*.json`; komponen HTML/JS merender berdasarkan data tersebut.
- **Kaya aset**: gambar, PDF, video thumbnail, dan ikon tersimpan di `src/assets/` sehingga mudah dilacak dalam version control.
- **Tema WordPress ringan**: tersedia di `wp-content/themes/blc-theme` untuk instalasi cepat sebagai front page WordPress.
- **I18n**: label utama tersedia dalam `src/i18n/` dan di-load lewat helper `t()`.

## Ringkasan struktur
- `src/assets/` – semua aset visual: logo, foto kegiatan, poster, video thumbnail, PDF lampiran.
- `src/components/` – komponen UI (navbar, footer, kartu, slider, judul seksi) berbasis HTML + JS modular.
- `src/data/` – sumber kebenaran konten (artikel, berita, kegiatan, galeri, divisi, staf, testimoni, dsb.).
- `src/pages/` – halaman siap pakai (`index.html`, `articles.html`, `events.html`, dll.) yang merangkai komponen dan data.
- `src/styles/` – token desain dan stylesheet global/komponen/halaman.
- `src/utils/` – helper DOM, i18n, dan bootstrap halaman.
- `wp-content/` – tema WordPress (`themes/blc-theme`) plus placeholder untuk unggahan bila repo ditempel di instalasi WP.
- `verification/` – berkas verifikasi statis (mis. Google/Bing) bila dibutuhkan hosting publik.

## Menjalankan secara lokal
1. Pastikan Node.js hanya untuk menjalankan server statis (tidak ada build). Install `serve` bila belum ada: `npm install -g serve`.
2. Dari root repo jalankan `serve src` atau `npx serve src`.
3. Buka `http://localhost:3000/pages/index.html` (atau `http://localhost:3000/pages/articles.html`, dll.).
4. Untuk melihat tema WordPress tanpa server WP, gunakan langkah 2–3 dan buka `wp-content/themes/blc-theme/` sebagai referensi struktur.

## Deploy
- **GitHub Pages/Netlify/Cloudflare Pages**: arahkan root deploy ke folder `src/` sehingga URL publik merujuk langsung ke `pages/*.html` dan `assets/`.
- **WordPress**: sertakan folder `src/` dalam unggahan (mis. `/wp-content/uploads/berandablc/`) lalu embed via iframe atau template tema (lihat bagian integrasi di bawah).
- **Kustom domain**: pastikan pengaturan caching mengizinkan file JSON di `src/data/` tidak diubah-ubah oleh minifier atau CDN yang agresif.

## Instalasi WordPress (tema bawaan)
Tema ringan sudah disertakan di `wp-content/themes/blc-theme` agar beranda BLC bisa langsung dijalankan di WordPress tanpa proses build. Langkah pemasangan lengkap:

1. **Siapkan berkas tema**
   - Kompres folder `wp-content/themes/blc-theme` menjadi ZIP, atau salin langsung ke server WordPress di path `wp-content/themes/`.
   - Tema memerlukan WordPress 6+ dan PHP 8+ agar fungsi-fungsi baru (caching transient, multisite) berjalan baik.
2. **Unggah & aktifkan**
   - Masuk ke **Appearance → Themes → Add New → Upload Theme** lalu unggah ZIP, atau pilih **Theme Details → Activate** jika sudah disalin manual.
3. **Atur halaman statis** agar `front-page.php` digunakan:
   - Buat halaman kosong berjudul “Beranda”.
   - Buka **Settings → Reading**, pilih **Static Page** dan set **Homepage** ke halaman “Beranda”.
4. **Konfigurasi sumber berita (multisite optional)**
   - Secara default tema menarik 6 pos terbaru dari blog ID `2` (konstanta `BLC_NEWS_BLOG_ID` di `wp-content/themes/blc-theme/functions.php`).
   - Jika subsite berita memiliki ID lain, ubah konstanta tersebut lalu simpan.
5. **Periksa aset**
   - CSS dan JS beranda sudah dienqueue otomatis (`assets/css/home.css` dan `assets/js/home.js`). Pastikan izin file server mengizinkan pembacaan berkas-berkas ini.
6. **Uji coba**
   - Kunjungi halaman depan situs. Bila kartu publikasi atau CTA tidak muncul, cek apakah subsite berita aktif dan memiliki pos berstatus publik.

## Integrasi dengan WordPress
Karena tanpa build, seluruh folder `src/` bisa langsung di-embed:
- **Iframe pada halaman/post**
  1. Unggah `src/` ke `/wp-content/uploads/berandablc/` atau plugin kustom.
  2. Tambah blok *Custom HTML* dengan `<iframe src="/wp-content/uploads/berandablc/pages/index.html" width="100%" height="100vh"></iframe>`.
- **Tema/child theme**
  1. Salin `src/` ke `/wp-content/themes/<tema-anda>/berandablc/`.
  2. Buat template PHP yang memanggil berkas HTML yang diinginkan dan enqueue CSS di `src/styles/`.
- **Konten dinamis dari WP**
  - Ekspos data lewat REST API lalu ubah helper `loadJSON` di `src/utils/helpers.js` (atau di script halaman) agar mengambil dari endpoint tersebut dengan bentuk data yang sama.

## Panduan pemutakhiran konten (lengkap)
Semua konten publik tersimpan di `src/data/` sebagai JSON. Alur umum setiap jenis konten:
- Unggah aset terkait (gambar, PDF, video thumbnail) ke `src/assets/`.
- Tambah/ubah entri pada JSON sesuai skema yang berlaku.
- Jalankan server statis dan verifikasi di halaman terkait.
- Commit & deploy.

### Artikel – `src/data/articles.json`
- **Bidang wajib**: `slug`, `title`, `categoryType`, `topics` (array string), `date` (`YYYY-MM-DD`), `excerpt`, `content`, `author` (`name`, `affiliation`).
- **Opsional**: `doi`, `issn`, `pdfUrl` (tautan PDF di `src/assets/`), atau `coverImage` untuk hero artikel.
- **Langkah unggah**:
  1. Simpan PDF atau gambar cover ke `src/assets/articles/` (buat folder bila belum ada).
  2. Tambahkan objek baru ke JSON dengan path aset relatif, mis. `"pdfUrl": "../assets/articles/pedoman.pdf"`.
  3. Artikel otomatis muncul di `articles.html`; halaman detail dipanggil via query `?slug=`.

### Berita – `src/data/news.json`
- Bidang: `slug`, `title`, `category`, `date`, `excerpt`, `image`, `link` (eksternal) **atau** `content` (internal).
- Unggah gambar ke `src/assets/news/`, rujuk dengan path relatif, lalu cek di beranda dan daftar berita.

### Kegiatan/Agenda – `src/data/events.json`
- Bidang: `slug`, `title`, `type`, `taxonomy`, `dateStart`, opsional `dateEnd`, `location`, `poster`, `excerpt`, `description`, opsional `minutesPdf`/`reportPdf`.
- Unggah poster dan materi ke `src/assets/events/`.
- Filter di `events.html` digerakkan oleh `type` dan `taxonomy`, jadi gunakan nilai konsisten (mis. `Webinar`, `Workshop`, `Internal`).

### Galeri foto & video – `src/data/gallery.json`
- **Foto**: objek dengan `title` dan `url` (path gambar di `src/assets/gallery/`).
- **Video**: `title`, `embed` (URL YouTube/Vimeo embeddable), opsional `thumbnail`.
- **Liputan/coverage**: `title`, `source`, `link`.
- Tambahkan aset ke `src/assets/gallery/` lalu masukkan entri baru ke array yang sesuai.

### Manajemen & struktur organisasi – `src/data/divisions.json` dan konten manajemen
- Detail divisi, direktorat, dan BPH berada di `src/data/divisions.json` serta konten halaman `src/pages/tentang-kami/manajemen/`.
- Untuk memperbarui daftar divisi atau staf:
  1. Perbarui entri `divisions` (nama, deskripsi, daftar anggota) di JSON.
  2. Jika ada file statis (mis. foto tim), unggah ke `src/assets/management/` dan rujuk di HTML/JSON.
  3. Cek tampilan di `pages/tentang-kami/manajemen/index.html`, `bph.html`, dan `divisi.html`.

### Logo & elemen identitas
- Simpan logo utama, variasi horizontal, dan favicon di `src/assets/logo/`.
- Navbar mengambil logo/mark dari komponen `src/components/Navbar.js`; ganti teks atau gambar di sana bila perlu.
- Perbarui favicon/link ikon di setiap halaman melalui tag `<link rel="icon">` di berkas `src/pages/` jika mengganti file.

### Teks statis lain
- **Program/hero/CTA**: disusun lewat `src/data/pages-content.json` dan markup pada setiap berkas di `src/pages/`.
- **Footer & kontak**: alamat dan tautan sosial berada di `src/data/site.json`.
- **Testimoni/tim**: cek `src/data/teams.json` atau berkas khusus lain di folder `data`.

## Alur kerja unggah (contoh lengkap)
1. Taruh aset baru di subfolder `src/assets/` yang relevan (buat folder baru bila diperlukan).
2. Tambahkan entri JSON dengan path relatif dari file yang akan membaca data (biasanya `../assets/...`).
3. Jalankan `npx serve src` dan buka halaman tujuan untuk memverifikasi render, tautan, dan preview gambar.
4. Lakukan pemeriksaan cepat di tampilan mobile (<=960px) untuk memastikan grid/menu tetap rapi.
5. Commit perubahan (`git commit`) lalu deploy ke host statis atau unggah folder `src/` ke WordPress (lihat bawah).

## Internasionalisasi
- Terjemahan berada di `src/i18n/en.json` dan `src/i18n/id.json`. Gunakan helper `t()` dari `src/utils/i18n.js` saat menambah label baru.
- Tambahkan kunci bahasa di kedua berkas untuk menjaga sinkronisasi navbar, hero, dan konten dinamis.

## Tips pemeliharaan
- **Konsistensi font**: variabel font berada di `src/styles/tokens.css`; menu dan dropdown memakai `--nav-font-family` dlsb.
- **Aksesibilitas**: komponen navbar/dropdown memakai aria-attributes; pastikan teks tautan deskriptif dan gambar memiliki `alt`.
- **Versi sumber**: simpan perubahan data (JSON) dan aset di repo ini agar histori perubahan terjaga.
- **Validasi tautan**: jalankan pemeriksaan manual pada tautan eksternal di `pages/` dan `data` setiap kali menambah konten besar.
- **Linting HTML/CSS opsional**: gunakan ekstensi VS Code (mis. HTMLHint/Stylelint) untuk menjaga konsistensi; proyek ini sengaja tanpa tooling build.

## Kontribusi
1. Fork repo ini atau buat branch baru.
2. Perbarui konten atau komponen sesuai panduan di atas.
3. Jalankan server lokal (`npx serve src`) untuk memverifikasi tampilan.
4. Pastikan perubahan JSON/HTML valid (tidak ada koma hilang/atribut salah) sebelum commit.
5. Buka PR dengan deskripsi perubahan dan lampirkan langkah uji manual yang dilakukan.
