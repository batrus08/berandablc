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
  const container = qs('#article-root');
  if (container) {
    setHTML(
      container,
      `<div class="card filter-card filter-card--skeleton" aria-hidden="true">
        <div class="skeleton skeleton__eyebrow"></div>
        <div class="skeleton skeleton__title"></div>
        <div class="skeleton skeleton__text"></div>
        <div class="skeleton skeleton__toolbar"></div>
      </div>`
    );
  }

  try {
    const articles = await loadJSON(new URL('../data/articles.json', import.meta.url).href);
    if (slug) {
      renderDetail(articles, slug);
    } else if (viewMode !== 'archive') {
      renderList(articles);
    }
    renderArchive(articles);
  } catch (error) {
    console.error('Failed to load articles:', error);
    if (container) {
      setHTML(container, `<p class="error-message">${t('common.errorLoading') || 'Gagal memuat data. Silakan coba lagi.'}</p>`);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupPage(renderPage);
});

function renderList(articles) {
  const container = qs('#article-root');
  if (!container) return;

  const categories = [...new Set(articles.map((a) => a.categoryType))];
  const selectedCategory = filterCategory || pageCategory || 'Semua';

  const headerMarkup = qs('.page-hero') ? '' : `
    <div class="section__header">
      <h1 class="section__title">${pageTitle}</h1>
      <p class="section__subtitle">${pageSubtitle}</p>
    </div>`;

  const markup = `
    ${headerMarkup}
    <div class="article-layout">
      <div class="card filter-card filter-card--elevated">
        <div class="filter-card__header">
          <div class="filter-card__heading">
            <span class="filter-chip">Koleksi BLC</span>
            <div class="filter-card__titles">
              <h3 class="filter-card__title">Telusuri artikel terkurasi</h3>
              <p class="filter-card__hint muted">Gunakan pencarian, kategori, atau topik untuk hasil paling relevan.</p>
            </div>
          </div>
          <div class="filter-card__actions">
            <button class="btn ghost reset-btn" type="button" id="reset-filters" aria-label="Reset filter artikel">
              <svg class="btn__icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 6v2.79c0 .45-.54.67-.85.35l-3.5-3.5a.5.5 0 0 1 0-.71l3.5-3.5c.31-.31.85-.09.85.36V5c3.86 0 7 3.14 7 7 0 1.12-.26 2.18-.72 3.12a.75.75 0 1 1-1.36-.64c.35-.74.54-1.57.54-2.48A5.5 5.5 0 0 0 12 6Z" fill="currentColor" />
                <path d="M12 18a5.5 5.5 0 0 1-4.46-8.68.75.75 0 0 0-1.2-.9A7 7 0 1 0 19 12.5c0-.17 0-.34-.02-.5a.75.75 0 0 0-1.5.12c.02.13.02.26.02.38A5.5 5.5 0 0 1 12 18Z" fill="currentColor" />
              </svg>
              <span class="reset-btn__label">Reset</span>
            </button>
          </div>
        </div>
        <div class="filter-toolbar">
          <label class="toolbar-field toolbar-field--search">
            <span class="toolbar-field__label">Cari</span>
            <div class="toolbar-input">
              <span class="toolbar-input__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="7"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input type="search" id="article-search" placeholder="Cari judul atau ringkasan…" aria-label="Cari artikel" />
            </div>
          </label>
          <label class="toolbar-field">
            <span class="toolbar-field__label">${t('articles.filterCategory')}</span>
            <div class="select-wrapper">
              <select id="category-filter" ${pageCategory ? 'disabled' : ''}>
                <option value="Semua" ${selectedCategory === 'Semua' ? 'selected' : ''}>${t('common.all')}</option>
                ${categories.map((c) => `<option ${selectedCategory === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
          </label>
          <label class="toolbar-field">
            <span class="toolbar-field__label">${t('articles.filterTopic')}</span>
            <div class="select-wrapper">
              <select id="topic-filter">
                <option value="Semua">${t('common.all')}</option>
                ${TOPIC_OPTIONS.map((topic) => `<option>${topic}</option>`).join('')}
              </select>
            </div>
          </label>
        </div>
      </div>
      <section class="article-panel" aria-label="Daftar artikel terkurasi">
        <div class="article-panel__header">
          <div>
            <p class="eyebrow">Hasil kurasi</p>
            <h3 class="article-panel__title">Artikel &amp; publikasi terbaru</h3>
            <p class="article-panel__description">Artikel ditampilkan sesuai filter yang dipilih.</p>
          </div>
          <span class="result-pill article-panel__pill" id="result-pill">
            <span id="result-count">${articles.length}</span> artikel
          </span>
        </div>
        <div id="article-list" class="grid article-grid"></div>
        <div id="article-empty" class="empty-state hidden">
          <div class="empty-state__icon" aria-hidden="true">🗂️</div>
          <div>
            <h3>Tidak ada artikel yang cocok…</h3>
            <p class="muted">Coba ubah kategori, pilih topik lain, atau gunakan kata kunci berbeda.</p>
          </div>
        </div>
      </section>
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
    const scoped = query ? byTopic.filter((a) => `${a.title || ''} ${a.excerpt || ''}`.toLowerCase().includes(query)) : byTopic;
    renderListItems(scoped);
    const empty = qs('#article-empty');
    if (scoped.length === 0) {
      empty.classList.remove('hidden');
    } else {
      empty.classList.add('hidden');
    }
    const counter = qs('#result-count');
    if (counter) counter.textContent = scoped.length;
    const pill = qs('#result-pill');
    if (pill) {
      pill.setAttribute('data-count', scoped.length);
      pill.innerHTML = `<span>${scoped.length}</span> artikel`;
    }
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
        <span>• ${article.author?.name || ''} (${article.author?.affiliation || ''})</span>
      </div>
      <div class="list-inline topic-list">${(article.topics || []).map((t) => `<span class="tag">${t}</span>`).join('')}</div>
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
