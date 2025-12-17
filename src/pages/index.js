import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { renderSectionTitle } from '../components/SectionTitle.js';
import { renderNewsCard } from '../components/NewsCard.js';
import { renderArticleCard } from '../components/ArticleCard.js';
import { bindNavbarToggle } from '../components/Navbar.js';
import { loadJSON, mergeAndSortContent, renderFocusCategories } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
  injectChrome();
  await renderLatestUpdates();
  renderFocusAreas();
  bindNavbarToggle(document);
});

function injectChrome() {
  const headerContainer = document.getElementById('site-header');
  const footerContainer = document.getElementById('site-footer');

  headerContainer.innerHTML = renderHeader();
  footerContainer.innerHTML = renderFooter();
}

async function renderLatestUpdates() {
  const updatesTitle = document.getElementById('latest-updates-title');
  const updatesGrid = document.getElementById('updates-grid');

  updatesTitle.innerHTML = renderSectionTitle({
    eyebrow: 'Publikasi Terbaru',
    title: 'Sorotan Hukum Bisnis',
    subtitle: 'Update terbaru dari news dan artikel komunitas hukum bisnis.',
  });

  try {
    const [news, articles] = await Promise.all([
      loadJSON('../data/news.json'),
      loadJSON('../data/articles.json'),
    ]);

    const newsWithType = news.map((item) => ({ ...item, type: 'news' }));
    const articlesWithType = articles.map((item) => ({ ...item, type: 'article' }));
    const combined = mergeAndSortContent(newsWithType, articlesWithType, 6);

    if (!combined.length) {
      updatesGrid.innerHTML = '<p class="empty-state">Belum ada pembaruan terbaru.</p>';
      return;
    }

    updatesGrid.innerHTML = combined
      .map((item) => (item.type === 'news' ? renderNewsCard(item) : renderArticleCard(item)))
      .join('');
  } catch (error) {
    updatesGrid.innerHTML = `<p class="empty-state">Gagal memuat data: ${error.message}</p>`;
  }
}

function renderFocusAreas() {
  const focusTitle = document.getElementById('focus-areas-title');
  const focusGrid = document.getElementById('focus-areas-grid');

  focusTitle.innerHTML = renderSectionTitle({
    eyebrow: 'Fokus Kajian',
    title: 'Kategori & Fokus Area',
    subtitle: 'Pilihan topik terkurasi untuk memperdalam literasi hukum bisnis.',
  });

  const categories = [
    { title: 'Edukasi Hukum', description: 'Materi pengayaan dan primer bagi mahasiswa hukum bisnis.' },
    { title: 'Analisis', description: 'Pembahasan mendalam kasus dan implikasi regulasi.' },
    { title: 'Berita', description: 'Update singkat regulasi, kebijakan, dan agenda penting.' },
    { title: 'Opini', description: 'Perspektif komunitas tentang isu-isu strategis ekonomi digital.' },
  ];

  focusGrid.innerHTML = renderFocusCategories(categories);
}
