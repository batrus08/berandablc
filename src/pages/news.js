import { mountLayout } from '../components/Layout.js';
import { renderSectionTitle } from '../components/SectionTitle.js';
import { renderNewsCard } from '../components/NewsCard.js';
import { loadJSON } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
  mountLayout();
  await renderNewsList();
});

async function renderNewsList() {
  const titleContainer = document.getElementById('news-title');
  const grid = document.getElementById('news-grid');

  titleContainer.innerHTML = renderSectionTitle({
    eyebrow: 'Publikasi',
    title: 'Arsip News',
    subtitle: 'Kumpulan publikasi terbaru dari komunitas hukum bisnis.',
  });

  try {
    const news = await loadJSON('../data/news.json');
    if (!news.length) {
      grid.innerHTML = '<p class="empty-state">Belum ada berita untuk ditampilkan.</p>';
      return;
    }

    grid.innerHTML = news.map((item) => renderNewsCard(item)).join('');
  } catch (error) {
    grid.innerHTML = `<p class="empty-state">Gagal memuat news: ${error.message}</p>`;
  }
}
