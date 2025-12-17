import { mountLayout } from '../components/Layout.js';
import { loadJSON, currentMonthItems, nextUpcoming, formatDate } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';
import { renderArticleCard } from '../components/ArticleCard.js';

async function init() {
  mountLayout();
  await renderLatestArticles();
  await renderUpcomingEvent();
}

document.addEventListener('DOMContentLoaded', init);

async function renderLatestArticles() {
  try {
    const articles = await loadJSON('../data/articles.json');
    const filtered = currentMonthItems(articles).slice(0, 3);
    const container = qs('#latest-articles');
    if (!filtered.length) {
      setHTML(container, '<p>Tidak ada artikel pada bulan ini.</p>');
      return;
    }
    setHTML(container, filtered.map(renderArticleCard).join(''));
  } catch (err) {
    setHTML(qs('#latest-articles'), `<p>${err.message}</p>`);
  }
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
