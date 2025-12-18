import { setupPage } from '../utils/page.js';
import { loadJSON, sortByDateDesc, formatDate, groupByMonthYear } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';
import { renderArticleCard } from '../components/ArticleCard.js';
import { renderPDFViewer } from '../components/PDFViewer.js';

const search = new URLSearchParams(window.location.search);
const slug = search.get('slug');
const filterCategory = search.get('category');
const pageCategory = document.body.dataset.category || null;
const pageTitle = document.body.dataset.title || 'Artikel & Publikasi';
const pageSubtitle = document.body.dataset.subtitle || 'Filter berdasarkan kategori dan topik';
const viewMode = document.body.dataset.view || 'list';

async function renderPage() {
  const articles = await loadJSON('../data/articles.json');
  if (slug) {
    renderDetail(articles, slug);
  } else {
    renderList(articles);
  }
  renderArchive(articles);
}

document.addEventListener('DOMContentLoaded', () => {
  setupPage(renderPage);
});

function renderList(articles) {
  const container = qs('#article-root');
  const categories = [...new Set(articles.map((a) => a.categoryType))];
  const topics = [...new Set(articles.flatMap((a) => a.topics))];
  const selectedCategory = filterCategory || pageCategory || 'Semua';

  const markup = `
    <div class="section__header">
      <h1 class="section__title">${pageTitle}</h1>
      <p class="section__subtitle">${pageSubtitle}</p>
    </div>
    <div class="card filter-card">
      <div class="stacked-gaps flex-between">
        <label>Kategori:
          <select id="category-filter" ${pageCategory ? 'disabled' : ''}>
            <option ${selectedCategory === 'Semua' ? 'selected' : ''}>Semua</option>
            ${categories.map((c) => `<option ${selectedCategory === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </label>
        <label>Topik:
          <select id="topic-filter">
            <option value="Semua">Semua</option>
            ${topics.map((t) => `<option>${t}</option>`).join('')}
          </select>
        </label>
      </div>
    </div>
    <div id="article-list" class="grid grid-3"></div>
  `;

  setHTML(container, markup);
  const filtered = selectedCategory === 'Semua' ? articles : articles.filter((a) => a.categoryType === selectedCategory);
  renderListItems(filtered);

  qs('#category-filter').addEventListener('change', (e) => {
    const val = e.target.value;
    if (pageCategory) return;
    window.location.href = val === 'Semua' ? './articles.html' : `./articles.html?category=${encodeURIComponent(val)}`;
  });
  qs('#topic-filter').addEventListener('change', (e) => {
    const topic = e.target.value;
    const scoped = topic === 'Semua' ? filtered : filtered.filter((a) => a.topics.includes(topic));
    renderListItems(scoped);
  });
}

function renderListItems(list) {
  const target = qs('#article-list');
  setHTML(target, list.map(renderArticleCard).join(''));
}

function renderDetail(articles, slugValue) {
  const target = qs('#article-root');
  const article = articles.find((a) => a.slug === slugValue);
  if (!article) {
    setHTML(target, '<p>Artikel tidak ditemukan.</p>');
    return;
  }
  setHTML(
    target,
    `
    <article class="card">
      <div class="badge">${article.categoryType}</div>
      <h1>${article.title}</h1>
      <div class="card__meta">
        <span>${formatDate(article.date)}</span>
        <span>• ${article.author.name} (${article.author.affiliation})</span>
      </div>
      <div class="list-inline topic-list">${article.topics.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      <div>${article.content}</div>
      ${article.doi ? `<p><strong>DOI:</strong> ${article.doi}</p>` : ''}
      ${article.issn ? `<p><strong>ISSN:</strong> ${article.issn}</p>` : ''}
      ${renderPDFViewer(article.pdfUrl)}
      <a class="btn secondary" href="./articles.html">Kembali ke daftar</a>
    </article>
  `
  );
}

function renderArchive(articles) {
  if (viewMode !== 'archive') {
    const archive = qs('#archive-list');
    if (archive) archive.classList.add('hidden');
    return;
  }
  const grouped = groupByMonthYear(articles);
  const target = qs('#archive-list');
  const markup = Object.entries(grouped)
    .map(
      ([label, items]) => `
      <div class="card">
        <h3>${label}</h3>
        <ul>
          ${sortByDateDesc(items)
            .map((item) => `<li><a href="./articles.html?slug=${item.slug}">${item.title}</a> – ${item.categoryType}</li>`)
            .join('')}
        </ul>
      </div>
    `
    )
    .join('');
  setHTML(target, `<div class="archive-grid">${markup}</div>`);
}
