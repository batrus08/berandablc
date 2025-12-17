import { renderTopbar } from '../components/Topbar.js';
import { renderNavbar, bindDropdowns } from '../components/Navbar.js';
import { renderFooter } from '../components/Footer.js';
import { renderServiceCard } from '../components/ServiceCard.js';
import { renderPostCard } from '../components/PostCard.js';
import { loadJSON, sortByDateDesc } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';

const services = [
  {
    title: 'Edukasi Hukum Bisnis',
    description: 'Kurikulum singkat, kelas tematik, dan modul praktik yang disusun bersama praktisi.',
    href: '#edukasi',
    icon: svgBook(),
  },
  {
    title: 'Klinik & Konsultasi',
    description: 'Pendampingan kasus dan advisory cepat untuk kebutuhan bisnis serta startup.',
    href: '#klinik',
    icon: svgChat(),
  },
  {
    title: 'Riset, Publikasi & Jejaring',
    description: 'Kolaborasi riset terapan, penerbitan insight, dan koneksi ke mitra strategis.',
    href: '#riset',
    icon: svgNetwork(),
  },
];

document.addEventListener('DOMContentLoaded', async () => {
  mountChrome();
  renderServices();
  await renderNewsEvents();
  bindDropdowns(document);
});

function mountChrome() {
  setHTML(qs('#topbar-root'), renderTopbar());
  setHTML(qs('#navbar-root'), renderNavbar());
  setHTML(qs('#site-footer'), renderFooter());
}

function renderServices() {
  const grid = qs('#service-grid');
  const markup = services.map((service) => renderServiceCard(service)).join('');
  setHTML(grid, markup);
}

async function renderNewsEvents() {
  const grid = qs('#news-grid');
  try {
    const [news, events] = await Promise.all([
      loadJSON('../data/news.json'),
      loadJSON('../data/events.json'),
    ]);

    const combined = sortByDateDesc([
      ...news.map((item) => ({ ...item, category: item.category || 'News' })),
      ...events.map((item) => ({ ...item, category: item.category || 'Event' })),
    ]).slice(0, 6);

    const markup = combined.map((item) => renderPostCard(item)).join('');
    setHTML(grid, markup);
  } catch (error) {
    setHTML(grid, `<p>Gagal memuat data: ${error.message}</p>`);
  }
}

function svgBook() {
  return `
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 4h9a3 3 0 013 3v11H7a2 2 0 00-2 2V4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
      <path d="M7 6h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  `;
}

function svgChat() {
  return `
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 5h14v9a2 2 0 01-2 2H9l-4 3V7a2 2 0 012-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
      <path d="M9 10h6M9 13h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  `;
}

function svgNetwork() {
  return `
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="7" r="3" stroke="currentColor" stroke-width="2" fill="none" />
      <circle cx="7" cy="17" r="3" stroke="currentColor" stroke-width="2" fill="none" />
      <circle cx="17" cy="17" r="3" stroke="currentColor" stroke-width="2" fill="none" />
      <path d="M9 15l2-3m2-3 2 3M9 9l-2 6m8-6 2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  `;
}
