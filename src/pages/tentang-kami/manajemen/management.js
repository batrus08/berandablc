import { setupPage } from '../../../utils/page.js';
import { qs, setHTML } from '../../../utils/dom.js';

// Operator upload path: place a ~1600x900 JPG under /uploads/struktur-manajemen.jpg (or adjust the constant below).
const STRUCTURE_IMAGE_PATH = '/uploads/struktur-manajemen.jpg';
const PLACEHOLDER_SRC =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg width="720" height="480" viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder struktur">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f3f4f6" />
          <stop offset="100%" stop-color="#e2e8f0" />
        </linearGradient>
      </defs>
      <rect width="720" height="480" fill="url(#grad)" rx="18" />
      <g stroke="#94a3b8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <rect x="310" y="74" width="100" height="60" rx="10" fill="#fff" />
        <rect x="170" y="196" width="120" height="58" rx="10" fill="#fff" />
        <rect x="430" y="196" width="120" height="58" rx="10" fill="#fff" />
        <rect x="90" y="322" width="130" height="56" rx="10" fill="#fff" />
        <rect x="270" y="322" width="130" height="56" rx="10" fill="#fff" />
        <rect x="450" y="322" width="130" height="56" rx="10" fill="#fff" />
        <line x1="360" y1="134" x2="230" y2="196" />
        <line x1="360" y1="134" x2="490" y2="196" />
        <line x1="230" y1="254" x2="155" y2="322" />
        <line x1="230" y1="254" x2="335" y2="322" />
        <line x1="490" y1="254" x2="335" y2="322" />
        <line x1="490" y1="254" x2="515" y2="322" />
      </g>
      <text x="360" y="112" text-anchor="middle" font-family="'Inter', sans-serif" font-size="16" fill="#0f172a" font-weight="700">Manajemen</text>
      <text x="230" y="222" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" fill="#1f2937">BPH</text>
      <text x="490" y="222" text-anchor="middle" font-family="'Inter', sans-serif" font-size="14" fill="#1f2937">Direktorat</text>
      <text x="155" y="348" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" fill="#334155">Internal</text>
      <text x="335" y="348" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" fill="#334155">Media</text>
      <text x="515" y="348" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13" fill="#334155">Eksternal</text>
    </svg>
  `);

const slugify = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '');

const pageCopy = {
  'management-overview': {
    hero: {
      title: 'Manajemen',
      intro:
        'Struktur manajemen BLC menjaga koordinasi lintas program, tata kelola yang transparan, dan komunikasi publik yang selaras. Halaman ini merangkum jalur keputusan utama dan akses menuju detail BPH serta divisi.',
    },
    type: 'overview',
  },
  'management-bph': {
    hero: {
      title: 'Badan Pengurus Harian (BPH)',
      intro:
        'BPH memastikan arah gerak organisasi tetap sejalan dengan roadmap tahunan, sekaligus menjaga ritme administrasi dan pengelolaan sumber daya.',
    },
    type: 'bph',
  },
  'management-divisi': {
    hero: {
      title: 'Divisi',
      intro:
        'Struktur divisi disusun sampai level koordinator untuk memastikan program berjalan terarah tanpa menampilkan rincian staf operasional.',
    },
    type: 'divisi',
  },
};

let cleanupLightbox;

document.addEventListener('DOMContentLoaded', () => {
  setupPage(renderManagementPage);
});

function renderManagementPage() {
  if (typeof cleanupLightbox === 'function') {
    cleanupLightbox();
  }

  const pageKey = document.body.dataset.page;
  const config = pageCopy[pageKey];
  if (!config) return;

  renderHero(config.hero);
  renderMainContent(config.type);
  const lightbox = buildLightbox();
  hydrateStructureCard(lightbox?.open);
  cleanupLightbox = lightbox?.cleanup;
}

function renderHero({ title, intro }) {
  setHTML(
    qs('#page-hero'),
    `
      <div class="container">
        <div class="page-hero__content">
          <p class="badge">Tentang Kami</p>
          <h1>${title}</h1>
          <p>${intro}</p>
        </div>
      </div>
    `
  );
}

function renderMainContent(type) {
  const main = qs('#management-main');
  const side = qs('#management-structure');
  if (!main || !side) return;

  if (type === 'overview') {
    renderOverview(main);
  }
  if (type === 'bph') {
    renderBph(main);
  }
  if (type === 'divisi') {
    renderDivisi(main);
  }

  renderStructureCard(side);
}

function renderOverview(target) {
  setHTML(
    target,
    `
      <article class="card management-summary">
        <h2>Ringkasan Manajemen</h2>
        <p class="lead">Pengambilan keputusan berfokus pada koordinasi lintas program dengan hanya menampilkan level pengarah hingga koordinator untuk menjaga keterbacaan struktur.</p>
        <ul class="management-list">
          <li>Rapat koordinasi rutin menjaga alur laporan dan tindak lanjut.</li>
          <li>Setiap kanal informasi dipisahkan per halaman agar konten tidak bercampur.</li>
        </ul>
      </article>
      <div class="management-card-grid">
        ${renderLinkCard('BPH', 'Ringkasan Direktur Utama, Sekretaris, dan Bendahara.', './bph.html')}
        ${renderLinkCard('Divisi', 'Direktorat Operasional dan Akademik hingga level Koordinator.', './divisi.html')}
      </div>
    `
  );
}

function renderLinkCard(title, description, href) {
  return `
    <a class="card management-link-card" href="${href}">
      <p class="chip">Navigasi</p>
      <h3>${title}</h3>
      <p>${description}</p>
    </a>
  `;
}

function renderBph(target) {
  const roles = [
    {
      title: 'Direktur Utama',
      body: 'Memimpin arah strategis, menetapkan prioritas, dan memastikan kolaborasi lintas direktorat tetap sinkron.',
    },
    {
      title: 'Sekretaris',
      body: 'Menjaga administrasi, penjadwalan rapat, dan dokumentasi keputusan agar seluruh pengurus memiliki satu sumber kebenaran.',
    },
    {
      title: 'Bendahara',
      body: 'Mengelola perencanaan anggaran, arus kas, serta kepatuhan pelaporan keuangan untuk setiap program.',
    },
  ];

  const cards = roles
    .map(
      (role) => `
        <article class="card role-card">
          <h3>${role.title}</h3>
          <p>${role.body}</p>
        </article>
      `
    )
    .join('');

  setHTML(
    target,
    `
      <article class="card management-summary">
        <h2>Struktur BPH</h2>
        <p class="lead">BPH bertugas menjaga tata kelola harian, menyambungkan arahan strategis dengan kebutuhan operasional, dan memastikan laporan siap disampaikan kapan pun dibutuhkan.</p>
      </article>
      <div class="management-card-grid">${cards}</div>
    `
  );
}

function renderDivisi(target) {
  const divisions = [
    {
      title: 'Direktorat Operasional',
      description: 'Mengelola operasional inti organisasi dan memastikan eksekusi program berjalan efisien.',
      roles: [
        {
          title: 'Direktur Operasional',
          note: 'Mengawal ritme harian, koordinasi antar divisi, dan kesiapan program.',
        },
        {
          title: 'Wakil Direktur Internal',
          note: 'Koordinator: akan diperbarui. Fokus pada kepatuhan proses dan dukungan keanggotaan.',
        },
        {
          title: 'Wakil Direktur Relasi Media',
          note: 'Koordinator: akan diperbarui. Menjaga pesan organisasi dan hubungan media.',
        },
        {
          title: 'Wakil Direktur Eksternal',
          note: 'Koordinator: akan diperbarui. Menjembatani kemitraan dan kolaborasi luar kampus.',
        },
      ],
    },
    {
      title: 'Direktorat Akademik',
      description: 'Mengarahkan kurikulum, riset, serta program pengembangan keilmuan di BLC.',
      roles: [
        {
          title: 'Direktur Akademik',
          note: 'Memastikan roadmap akademik berjalan sesuai kalender pembelajaran.',
        },
        {
          title: 'Wakil Direktur Keilmuan',
          note: 'Koordinator: akan diperbarui. Mengawal pengembangan materi kajian.',
        },
        {
          title: 'Wakil Direktur Perlombaan',
          note: 'Koordinator: akan diperbarui. Menyiapkan delegasi dan kesiapan kompetisi.',
        },
      ],
    },
  ];

  const divisionCards = divisions
    .map(
      (division) => `
        <article class="card division-card" id="${slugify(division.title)}">
          <div>
            <p class="chip">${division.title}</p>
            <p class="muted">${division.description}</p>
          </div>
          <div class="division-card__roles">
            ${division.roles
              .map(
                (role) => `
                  <div class="division-card__role">
                    <h4>${role.title}</h4>
                    <p>${role.note}</p>
                  </div>
                `
              )
              .join('')}
          </div>
        </article>
      `
    )
    .join('');

  setHTML(
    target,
    `
      <article class="card management-summary">
        <h2>Struktur Divisi</h2>
        <p class="lead">Pembagian peran dibatasi sampai Koordinator agar jalur eskalasi jelas tanpa menampilkan level staf atau detail cabang.</p>
      </article>
      <div class="management-card-grid">${divisionCards}</div>
    `
  );
}

function renderStructureCard(target) {
  setHTML(
    target,
    `
      <article class="card structure-card">
        <div class="structure-card__header">
          <div>
            <p class="eyebrow">Struktur Organisasi</p>
            <h3>Manajemen</h3>
          </div>
          <button class="icon-btn" type="button" data-open-structure aria-label="Perbesar struktur">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <rect x="3" y="3" width="7" height="7" rx="2"></rect>
              <rect x="14" y="3" width="7" height="7" rx="2"></rect>
              <rect x="14" y="14" width="7" height="7" rx="2"></rect>
              <rect x="3" y="14" width="7" height="7" rx="2"></rect>
            </svg>
          </button>
        </div>
        <div class="structure-card__media">
          <img src="" alt="Struktur organisasi Business Law Community" data-structure-image loading="lazy" />
        </div>
        <p class="structure-card__caption">Gambar struktur dapat diperbarui oleh operator.</p>
        <p class="structure-card__note">Jika unggahan di jalur konfigurasi belum tersedia, placeholder netral akan ditampilkan otomatis.</p>
      </article>
    `
  );
}

function hydrateStructureCard(openLightbox) {
  const image = qs('[data-structure-image]');
  const previewButton = qs('[data-open-structure]');
  if (!image) return;

  const safeOpen = () => openLightbox?.(image.currentSrc || image.src || PLACEHOLDER_SRC);

  const applyPlaceholder = () => {
    image.dataset.usingPlaceholder = 'true';
    image.src = PLACEHOLDER_SRC;
  };

  image.addEventListener('error', applyPlaceholder, { once: true });
  image.src = image.dataset.source || STRUCTURE_IMAGE_PATH;

  image.addEventListener('click', safeOpen);
  previewButton?.addEventListener('click', safeOpen);
}

function buildLightbox() {
  const root = qs('#lightbox-root');
  if (!root) return null;

  setHTML(
    root,
    `
      <div class="lightbox" data-lightbox hidden>
        <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="Pratinjau struktur manajemen">
          <button class="lightbox__close" type="button" data-lightbox-close aria-label="Tutup pratinjau">✕</button>
          <img src="${PLACEHOLDER_SRC}" alt="Pratinjau struktur manajemen" data-lightbox-image />
          <p class="structure-card__caption">Gambar struktur dapat diperbarui oleh operator.</p>
        </div>
      </div>
    `
  );

  const lightbox = root.querySelector('[data-lightbox]');
  const modalImage = root.querySelector('[data-lightbox-image]');
  const closeButtons = root.querySelectorAll('[data-lightbox-close]');

  const close = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('hidden', 'true');
    document.body.classList.remove('no-scroll');
  };

  const open = (src) => {
    if (!lightbox || !modalImage) return;
    modalImage.onerror = () => {
      modalImage.src = PLACEHOLDER_SRC;
    };
    modalImage.src = src || PLACEHOLDER_SRC;
    lightbox.classList.add('open');
    lightbox.removeAttribute('hidden');
    document.body.classList.add('no-scroll');
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      close();
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === lightbox) {
      close();
    }
  };

  document.addEventListener('keydown', handleKeydown);
  lightbox?.addEventListener('click', handleBackdropClick);
  closeButtons.forEach((btn) => btn.addEventListener('click', close));

  return {
    open,
    cleanup: () => {
      close();
      document.removeEventListener('keydown', handleKeydown);
      lightbox?.removeEventListener('click', handleBackdropClick);
      closeButtons.forEach((btn) => btn.removeEventListener('click', close));
    },
  };
}
