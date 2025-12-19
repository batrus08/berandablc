import { setupPage } from '../utils/page.js';
import { loadJSON, sortByDateDesc, formatDate, groupByMonthYear } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';
import { t } from '../utils/i18n.js';
import { renderArticleCard } from '../components/ArticleCard.js';
import { renderPDFViewer } from '../components/PDFViewer.js';

const search = new URLSearchParams(window.location.search);
const slug = search.get('slug');
const filterCategory = search.get('category');
const pageCategory = document.body.dataset.category || null;
const pageTitle = document.body.dataset.title || 'Artikel & Publikasi';
const pageSubtitle = document.body.dataset.subtitle || 'Filter berdasarkan kategori dan topik';
const viewMode = document.body.dataset.view || 'list';
const TOPIC_OPTIONS = [
  'Pasar Modal',
  'Energi & Sumberdaya',
  'Perusahaan & Anti Monopoli',
  'Hak kekayaan intelektual',
  'Pembiayaan & Perbankan',
  'Perdagangan internasional',
];

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
  const selectedCategory = filterCategory || pageCategory || 'Semua';

  const headerMarkup = qs('.page-hero') ? '' : `
    <div class="section__header">
      <h1 class="section__title">${pageTitle}</h1>
      <p class="section__subtitle">${pageSubtitle}</p>
    </div>`;

  const markup = `
    ${headerMarkup}
    <div class="card filter-card filter-card--compact">
      <div class="filter-card__top">
        <div class="filter-card__intro">
          <span class="filter-chip">Koleksi BLC</span>
          <div>
            <h3 class="filter-card__title">Telusuri artikel terkurasi</h3>
            <p class="filter-card__hint muted">Gunakan pencarian, kategori, atau topik untuk hasil paling relevan.</p>
          </div>
        </div>
        <div class="filter-card__meta">
          <div class="meta-stat">
            <span class="meta-stat__value" id="result-count">${articles.length}</span>
            <span class="meta-stat__label">artikel tersedia</span>
          </div>
          <button class="btn tertiary" type="button" id="reset-filters">
            <span class="material-symbols-outlined" aria-hidden="true">restart_alt</span>
            Reset
          </button>
        </div>
      </div>
      <div class="filter-card__controls filter-card__controls--condensed">
        <label class="filter-field">
          <span class="filter-field__label">Cari judul atau ringkasan</span>
          <div class="input-with-icon">
            <span class="material-symbols-outlined" aria-hidden="true">search</span>
            <input type="search" id="article-search" placeholder="Cari artikel..." aria-label="Cari artikel" />
          </div>
        </label>
        <label class="filter-field">
          <span class="filter-field__label">${t('articles.filterCategory')}</span>
          <div class="select-wrapper">
            <select id="category-filter" ${pageCategory ? 'disabled' : ''}>
              <option value="Semua" ${selectedCategory === 'Semua' ? 'selected' : ''}>${t('common.all')}</option>
              ${categories.map((c) => `<option ${selectedCategory === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </label>
        <label class="filter-field">
          <span class="filter-field__label">${t('articles.filterTopic')}</span>
          <div class="select-wrapper">
            <select id="topic-filter">
              <option value="Semua">${t('common.all')}</option>
              ${TOPIC_OPTIONS.map((topic) => `<option>${topic}</option>`).join('')}
            </select>
          </div>
        </label>
      </div>
    </div>
    <div id="article-list" class="grid grid-3"></div>
    <div id="article-empty" class="empty-state hidden">
      <div class="empty-state__icon" aria-hidden="true">🗂️</div>
      <div>
        <h3>Tidak ada hasil</h3>
        <p class="muted">Coba ubah kategori, pilih topik lain, atau gunakan kata kunci berbeda.</p>
      </div>
    </div>
  `;

  setHTML(container, markup);
  const state = {
    category: selectedCategory,
    topic: 'Semua',
    query: '',
  };

  const filteredByCategory = () =>
    state.category === 'Semua' ? articles : articles.filter((a) => a.categoryType === state.category);

  const applyFilters = () => {
    const query = state.query.trim().toLowerCase();
    const base = filteredByCategory();
    const byTopic = state.topic === 'Semua' ? base : base.filter((a) => a.topics.some((tpc) => tpc.toLowerCase().includes(state.topic.toLowerCase())));
    const scoped = query ? byTopic.filter((a) => `${a.title} ${a.excerpt}`.toLowerCase().includes(query)) : byTopic;
    renderListItems(scoped);
    const empty = qs('#article-empty');
    if (scoped.length === 0) {
      empty.classList.remove('hidden');
    } else {
      empty.classList.add('hidden');
    }
    const counter = qs('#result-count');
    if (counter) counter.textContent = scoped.length;
  };

  applyFilters();

  qs('#category-filter').addEventListener('change', (e) => {
    const val = e.target.value;
    if (pageCategory) return;
    state.category = val;
    const newPath = window.location.pathname.split('/').pop();
    window.history.replaceState({}, '', val === 'Semua' ? newPath : `${newPath}?category=${encodeURIComponent(val)}`);
    applyFilters();
  });

  qs('#topic-filter').addEventListener('change', (e) => {
    state.topic = e.target.value;
    applyFilters();
  });

  qs('#article-search').addEventListener('input', (e) => {
    state.query = e.target.value;
    applyFilters();
  });

  const resetBtn = qs('#reset-filters');
  if (resetBtn) {
    const categorySelect = qs('#category-filter');
    const topicSelect = qs('#topic-filter');
    const searchInput = qs('#article-search');
    const defaultCategory = pageCategory || 'Semua';

    resetBtn.addEventListener('click', () => {
      state.query = '';
      state.topic = 'Semua';
      state.category = defaultCategory;

      searchInput.value = '';
      topicSelect.value = 'Semua';
      if (!pageCategory) {
        categorySelect.value = 'Semua';
        const newPath = window.location.pathname.split('/').pop();
        window.history.replaceState({}, '', newPath);
      } else {
        categorySelect.value = defaultCategory;
      }

      applyFilters();
    });
  }
}

function renderListItems(list) {
  const target = qs('#article-list');
  setHTML(target, list.map(renderArticleCard).join(''));
}

function renderDetail(articles, slugValue) {
  const target = qs('#article-root');
  const article = articles.find((a) => a.slug === slugValue);
  if (!article) {
    setHTML(target, `<p>${t('articles.notFound')}</p>`);
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
      <a class="btn secondary" href="./articles.html">${t('articles.backToList')}</a>
    </article>
  `
  );
}

function renderArchive(articles) {
  const target = qs('#archive-list');
  if (!target) return;

  const grouped = groupByMonthYear(articles);
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
