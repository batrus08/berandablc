import { mountLayout } from '../components/Layout.js';
import { renderArticleCard } from '../components/ArticleCard.js';
import { renderNewsCard } from '../components/NewsCard.js';
import { renderSectionTitle } from '../components/SectionTitle.js';
import { loadJSON, sortByDateDesc, formatDate, nextUpcoming } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';

const focusAreas = [
  {
    label: 'Edukasi Hukum',
    title: 'Edukasi & Klinik',
    description: 'Toolkit dasar compliance dan praktik kontrak untuk anggota baru.',
    items: ['Modul pemula', 'Workshop drafting', 'Klinik konsultasi'],
  },
  {
    label: 'Analisis',
    title: 'Analisis Regulasi',
    description: 'Insight berkala atas kebijakan bisnis, ESG, dan data governance.',
    items: ['Analisis regulasi', 'Update kebijakan ESG', 'Riset tematik'],
  },
  {
    label: 'Berita',
    title: 'Berita & Agenda',
    description: 'Kumpulan kabar komunitas, kemitraan, serta agenda legal terbaru.',
    items: ['Sorotan kasus', 'Update acara', 'Kemitraan kampus'],
  },
  {
    label: 'Opini',
    title: 'Opini & Kolaborasi',
    description: 'Ruang opini, resensi, dan kolaborasi lintas divisi untuk publikasi.',
    items: ['Forum diskusi', 'Resensi buku', 'Kolaborasi riset'],
  },
];

document.addEventListener('DOMContentLoaded', init);

async function init() {
  mountLayout();
  renderSectionHeaders();
  renderFocusAreas();
  await renderLatestUpdates();
  await renderUpcomingEvent();
}

function renderSectionHeaders() {
  setHTML(
    qs('#latest-updates-header'),
    renderSectionTitle({
      eyebrow: 'Gabungan news & artikel',
      title: 'Latest Updates',
      subtitle: 'Urut berdasarkan tanggal terbaru dari data JSON.',
    })
  );

  setHTML(
    qs('#focus-areas-header'),
    renderSectionTitle({
      eyebrow: 'Kategori konten',
      title: 'Fokus Kajian',
      subtitle: 'Edukasi hukum, analisis, berita, dan opini dalam format modular.',
    })
  );
}

async function renderLatestUpdates() {
  const target = qs('#latest-updates-list');

  try {
    const [news, articles] = await Promise.all([
      loadJSON('../data/news.json'),
      loadJSON('../data/articles.json'),
    ]);

    const normalized = [
      ...news.map((item) => ({ ...item, type: 'news' })),
      ...articles.map((item) => ({ ...item, type: 'article' })),
    ];

    const latest = sortByDateDesc(normalized, 'date').slice(0, 6);

    if (!latest.length) {
      setHTML(target, '<p>Tidak ada pembaruan terbaru.</p>');
      return;
    }

    const markup = latest
      .map((item) => (item.type === 'news' ? renderNewsCard(item) : renderArticleCard(item)))
      .join('');

    setHTML(target, markup);
  } catch (error) {
    setHTML(target, `<p>${error.message}</p>`);
  }
}

function renderFocusAreas() {
  const container = qs('#focus-area-grid');
  const markup = focusAreas
    .map(
      (area) => `
      <article class="card focus-card">
        <p class="eyebrow">${area.label}</p>
        <h3>${area.title}</h3>
        <p class="muted">${area.description}</p>
        <ul class="list-inline">${area.items.map((item) => `<li class="tag">${item}</li>`).join('')}</ul>
      </article>
    `
    )
    .join('');

  setHTML(container, markup);
}

async function renderUpcomingEvent() {
  try {
    const events = await loadJSON('../data/events.json');
    const upcoming = nextUpcoming(events);
    const target = qs('#upcoming-event');
    if (!upcoming) {
      setHTML(target, '<p>Belum ada jadwal acara mendatang.</p>');
      return;
    }
    setHTML(
      target,
      `
      <div class="meta-row">
        <span class="badge">${upcoming.type}</span>
        <span>${formatDate(upcoming.dateStart)}${upcoming.dateEnd ? ' - ' + formatDate(upcoming.dateEnd) : ''}</span>
        <span>${upcoming.location}</span>
      </div>
      <h3>${upcoming.title}</h3>
      <p class="muted">${upcoming.excerpt}</p>
      <a class="btn primary" href="./events.html?slug=${upcoming.slug}">Detail Agenda</a>
    `
    );
  } catch (error) {
    setHTML(qs('#upcoming-event'), `<p>${error.message}</p>`);
  }
}
