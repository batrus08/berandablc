import { setupPage } from '../utils/page.js';
import { loadJSON, formatDate, sortByDateDesc } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';
import { renderCalendar } from '../components/Calendar.js';

const search = new URLSearchParams(window.location.search);
const slug = search.get('slug');
const filterType = search.get('type');
const datasetType = document.body.dataset.type || null;
const datasetTaxonomy = document.body.dataset.taxonomy || null;
const pageTitle = document.body.dataset.title || 'Kegiatan & Event';
const pageSubtitle = document.body.dataset.subtitle || 'Semua agenda komunitas';

async function renderPage() {
  const events = await loadJSON('../data/events.json');
  if (slug) {
    renderDetail(events, slug);
  } else {
    renderList(events);
  }
  renderCalendarSection(events);
  renderDocumentation(events);
}

document.addEventListener('DOMContentLoaded', () => {
  setupPage(renderPage);
});

function renderList(events) {
  const container = qs('#event-root');
  const types = [...new Set(events.map((e) => e.type))];
  const taxonomies = ['Semua', ...new Set(events.map((e) => e.taxonomy))];
  const selectedType = filterType || datasetType || 'Semua';
  const selectedTaxonomy = datasetTaxonomy || 'Semua';
  const markup = `
    <div class="section__header">
      <h1 class="section__title">${pageTitle}</h1>
      <p class="section__subtitle">${pageSubtitle}</p>
    </div>
    <div class="card filter-card">
      <div class="stacked-gaps flex-between">
        <label>Jenis kegiatan
          <select id="type-filter" ${datasetType ? 'disabled' : ''}>
            <option ${selectedType === 'Semua' ? 'selected' : ''}>Semua</option>
            ${types.map((t) => `<option ${selectedType === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </label>
        <label>Jenis program
          <select id="taxonomy-filter" ${datasetTaxonomy ? 'disabled' : ''}>
            ${taxonomies.map((t) => `<option ${selectedTaxonomy === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </label>
      </div>
    </div>
    <div id="event-list" class="grid grid-3"></div>
  `;
  setHTML(container, markup);
  let filtered = selectedType === 'Semua' ? events : events.filter((e) => e.type === selectedType);
  if (selectedTaxonomy !== 'Semua') {
    filtered = filtered.filter((e) => e.taxonomy === selectedTaxonomy);
  }
  renderEventCards(filtered);

  qs('#type-filter').addEventListener('change', (e) => {
    const val = e.target.value;
    if (datasetType) return;
    window.location.href = val === 'Semua' ? './events.html' : `./events.html?type=${encodeURIComponent(val)}`;
  });
  qs('#taxonomy-filter').addEventListener('change', (e) => {
    const val = e.target.value;
    const scoped = val === 'Semua' ? filtered : filtered.filter((ev) => ev.taxonomy === val);
    renderEventCards(scoped);
  });
}

function renderEventCards(list) {
  const target = qs('#event-list');
  const markup = list
    .map(
      (event) => `
      <article class="card">
        <img src="${event.poster}" alt="Poster ${event.title}" />
        <div class="badge">${event.type} • ${event.taxonomy}</div>
        <h3><a href="./events.html?slug=${event.slug}">${event.title}</a></h3>
        <div class="card__meta">
          <span>${formatDate(event.dateStart)}</span>
          <span>• ${event.location}</span>
        </div>
        <p class="muted">${event.excerpt}</p>
      </article>
    `
    )
    .join('');
  setHTML(target, markup);
}

function renderDetail(events, slugValue) {
  const target = qs('#event-root');
  const event = events.find((e) => e.slug === slugValue);
  if (!event) {
    setHTML(target, '<p>Agenda tidak ditemukan.</p>');
    return;
  }
  setHTML(
    target,
    `
    <article class="card">
      <div class="badge">${event.type} • ${event.taxonomy}</div>
      <h1>${event.title}</h1>
      <div class="card__meta">
        <span>${formatDate(event.dateStart)}${event.dateEnd ? ' - ' + formatDate(event.dateEnd) : ''}</span>
        <span>• ${event.location}</span>
      </div>
      ${event.poster ? `<img src="${event.poster}" alt="Poster ${event.title}" />` : ''}
      <div>${event.description}</div>
      ${event.minutesPdf ? `<p><a class="btn secondary" href="${event.minutesPdf}">Notulensi</a></p>` : ''}
      ${event.reportPdf ? `<p><a class="btn secondary" href="${event.reportPdf}">Laporan Kegiatan</a></p>` : ''}
      <a class="btn primary" href="./events.html">Kembali ke daftar</a>
    </article>
  `
  );
}

function renderCalendarSection(events) {
  const calendarTarget = qs('#calendar');
  if (!calendarTarget) return;
  setHTML(calendarTarget, renderCalendar(events));
}

function renderDocumentation(events) {
  const target = qs('#documentation');
  if (!target) return;
  const docs = sortByDateDesc(events).slice(0, 3);
  setHTML(
    target,
    docs
      .map(
        (doc) => `
        <article class="card card--horizontal">
          <img src="${doc.poster}" alt="${doc.title}" />
          <div>
            <div class="badge">${doc.type}</div>
            <h3>${doc.title}</h3>
            <p class="muted">${doc.excerpt}</p>
          </div>
        </article>
      `
      )
      .join('')
  );
}
