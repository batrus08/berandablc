import { mountLayout } from '../components/Layout.js';
import { loadJSON, formatDate, sortByDateDesc } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';
import { renderCalendar } from '../components/Calendar.js';

const search = new URLSearchParams(window.location.search);
const slug = search.get('slug');
const filterType = search.get('type');

async function init() {
  mountLayout();
  const events = await loadJSON('../data/events.json');
  if (slug) {
    renderDetail(events, slug);
  } else {
    renderList(events);
  }
  renderCalendarSection(events);
  renderDocumentation(events);
}

document.addEventListener('DOMContentLoaded', init);

function renderList(events) {
  const container = qs('#event-root');
  const types = [
    'Seminar & Webinar',
    'Diskusi Hukum',
    'Pelatihan Legal Skill',
    'Kompetisi / Call for Paper',
    'Program & Aktivitas Lainnya',
  ];
  const selectedType = filterType || 'Semua';
  const markup = `
    <div class="section__header">
      <h1 class="section__title">Kegiatan & Event</h1>
      <p class="section__subtitle">Semua agenda komunitas</p>
    </div>
    <div class="card filter-card">
      <label>Jenis kegiatan
        <select id="type-filter">
          <option ${selectedType === 'Semua' ? 'selected' : ''}>Semua</option>
          ${types.map((t) => `<option ${selectedType === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </label>
    </div>
    <div id="event-list" class="grid grid-3"></div>
  `;
  setHTML(container, markup);
  const filtered = selectedType === 'Semua' ? events : events.filter((e) => e.type === selectedType);
  renderEventCards(filtered);

  qs('#type-filter').addEventListener('change', (e) => {
    const val = e.target.value;
    window.location.href = val === 'Semua' ? './events.html' : `./events.html?type=${encodeURIComponent(val)}`;
  });
}

function renderEventCards(list) {
  const target = qs('#event-list');
  const markup = list
    .map(
      (event) => `
      <article class="card">
        <img src="${event.poster}" alt="Poster ${event.title}" />
        <div class="badge">${event.type}</div>
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
      <div class="badge">${event.type}</div>
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
  setHTML(calendarTarget, renderCalendar(events));
}

function renderDocumentation(events) {
  const docs = sortByDateDesc(events).slice(0, 3);
  const target = qs('#documentation');
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
