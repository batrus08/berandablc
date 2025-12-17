import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { renderSectionTitle } from '../components/SectionTitle.js';
import { renderArticleCard } from '../components/ArticleCard.js';
import { bindNavbarToggle } from '../components/Navbar.js';
import { loadJSON } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('site-header').innerHTML = renderHeader();
  document.getElementById('site-footer').innerHTML = renderFooter();
  bindNavbarToggle(document);
  await renderArticlesList();
});

async function renderArticlesList() {
  const titleContainer = document.getElementById('articles-title');
  const grid = document.getElementById('articles-grid');

  titleContainer.innerHTML = renderSectionTitle({
    eyebrow: 'Referensi',
    title: 'Arsip Artikel',
    subtitle: 'Kumpulan artikel analisis dan opini dari komunitas.',
  });

  try {
    const articles = await loadJSON('../data/articles.json');
    if (!articles.length) {
      grid.innerHTML = '<p class="empty-state">Belum ada artikel untuk ditampilkan.</p>';
      return;
    }

    grid.innerHTML = articles.map((item) => renderArticleCard(item)).join('');
  } catch (error) {
    grid.innerHTML = `<p class="empty-state">Gagal memuat artikel: ${error.message}</p>`;
  }
}
