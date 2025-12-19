import { setupPage } from '../../../utils/page.js';
import { qs, setHTML } from '../../../utils/dom.js';

const slugify = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '');
const PERSON_PLACEHOLDER = new URL('../../../assets/images/placeholder-person.jpg', import.meta.url).href;

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

document.addEventListener('DOMContentLoaded', () => {
  setupPage(renderManagementPage);
});

function renderManagementPage() {
  const pageKey = document.body.dataset.page;
  const config = pageCopy[pageKey];
  if (!config) return;

  renderHero(config.hero);
  renderMainContent(config.type);
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
  if (!main) return;

  if (type === 'overview') {
    renderOverview(main);
  }
  if (type === 'bph') {
    renderBph(main);
  }
  if (type === 'divisi') {
    renderDivisi(main);
  }
}

function personCard({ name, role, photo = PERSON_PLACEHOLDER }) {
  return `
    <article class="card person-card">
      <img src="${photo}" alt="${name}" loading="lazy" />
      <div>
        <p class="person-card__name">${name}</p>
        <p class="person-card__role">${role}</p>
      </div>
    </article>
  `;
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
  const hierarchy = {
    leader: { name: 'Nama Pengurus', role: 'Direktur Utama' },
    supports: [
      { name: 'Nama Pengurus', role: 'Sekretaris' },
      { name: 'Nama Pengurus', role: 'Bendahara' },
    ],
    directors: [
      { name: 'Nama Pengurus', role: 'Direktur Operasional' },
      { name: 'Nama Pengurus', role: 'Direktur Akademik' },
    ],
  };

  setHTML(
    target,
    `
      <section class="org-section" aria-label="Struktur BPH">
        <header class="section-header">
          <p class="eyebrow">Bagan Struktur</p>
          <h2>Struktur BPH</h2>
          <p class="muted">Garis komando dari Direktur Utama hingga jajaran direktur untuk memastikan koordinasi harian.</p>
        </header>
        <div class="structure-diagram">
          <div class="tree-scroller" aria-label="Bagan BPH">
            <div class="org-tree">
              <div class="tree-level" style="--columns: 1">
                ${personCard(hierarchy.leader)}
              </div>
              <div class="tree-level" data-connect="true" style="--columns: 2">
                ${hierarchy.supports.map(personCard).join('')}
              </div>
              <div class="tree-level" data-connect="true" style="--columns: 2">
                ${hierarchy.directors.map(personCard).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>
    `
  );
}

function renderDivisi(target) {
  const operasional = {
    title: 'Operasional',
    description: 'Tata kelola kegiatan internal dan relasi publik.',
    director: { name: 'Nama Pengurus', role: 'Direktur Operasional' },
    deputies: [
      {
        person: { name: 'Nama Pengurus', role: 'Wakil Direktur Internal' },
        children: [
          { name: 'Nama Pengurus', role: 'Koordinator Personalia' },
          { name: 'Nama Pengurus', role: 'Koordinator HRD' },
        ],
      },
      {
        person: { name: 'Nama Pengurus', role: 'Wakil Direktur Relasi Media' },
        children: [
          { name: 'Nama Pengurus', role: 'Koordinator Manajemen IT' },
          { name: 'Nama Pengurus', role: 'Koordinator Media Sosial' },
        ],
      },
      {
        person: { name: 'Nama Pengurus', role: 'Wakil Direktur Eksternal' },
        children: [
          { name: 'Nama Pengurus', role: 'Koordinator Hubungan Klien & Sponsorship' },
          { name: 'Nama Pengurus', role: 'Koordinator Alumni Network' },
        ],
      },
    ],
  };

  const akademik = {
    title: 'Akademik',
    description: 'Pengembangan kurikulum, kompetisi, dan kajian hukum bisnis.',
    director: { name: 'Nama Pengurus', role: 'Direktur Akademik' },
    deputies: [
      {
        person: { name: 'Nama Pengurus', role: 'Wakil Direktur Keilmuan' },
        children: [
          { name: 'Nama Pengurus', role: 'Pasar Modal' },
          { name: 'Nama Pengurus', role: 'ESDM' },
          { name: 'Nama Pengurus', role: 'Perusahaan dan Anti Monopoli' },
          { name: 'Nama Pengurus', role: 'HKI' },
          { name: 'Nama Pengurus', role: 'Pembiayaan dan Perbankan' },
          { name: 'Nama Pengurus', role: 'Perdagangan Internasional' },
        ],
      },
      {
        person: { name: 'Nama Pengurus', role: 'Wakil Direktur Perlombaan' },
        children: [
          { name: 'Nama Pengurus', role: 'Koordinator Delegasi' },
          { name: 'Nama Pengurus', role: 'Koordinator Managerial' },
        ],
      },
    ],
  };

  setHTML(
    target,
    `
      <div class="division-layout">
        ${renderDivisionSection(operasional)}
        ${renderDivisionSection(akademik)}
      </div>
    `
  );
}

function renderDivisionSection(division) {
  return `
    <section class="division-tree" id="direktorat-${slugify(division.title)}" aria-label="Divisi ${division.title}">
      <header class="section-header tree-header">
        <div class="chip">${division.title}</div>
        <p class="muted">${division.description}</p>
      </header>
      <div class="structure-diagram">
        <div class="tree-scroller" aria-label="Bagan Divisi ${division.title}">
          <div class="org-tree">
            <div class="tree-level" style="--columns: 1">
              ${personCard(division.director)}
            </div>
            <div class="tree-level" data-connect="true" style="--columns: ${division.deputies.length}">
              ${division.deputies.map((item) => personCard(item.person)).join('')}
            </div>
            <div class="branch-grid" style="--columns: ${division.deputies.length}">
              ${division.deputies
                .map(
                  (item) => `
                    <div class="branch" data-connect="true">
                      <div class="branch__children" style="--columns: ${item.children.length}">
                        ${item.children.map(personCard).join('')}
                      </div>
                    </div>
                  `
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
