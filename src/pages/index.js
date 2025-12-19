import { setupPage } from '../utils/page.js';
import { renderContentCard } from '../components/ContentCard.js';
import { loadJSON, sortByDateDesc, filterUpcomingEvents, formatDate, monthNames } from '../utils/helpers.js';
import { qs, setHTML } from '../utils/dom.js';
import { getCurrentLanguage, t } from '../utils/i18n.js';

const heroSlides = [
  {
    className: 'hero__slide--1',
    translationKey: 'hero.slides.0'
  },
  {
    className: 'hero__slide--2',
    translationKey: 'hero.slides.1'
  },
  {
    className: 'hero__slide--3',
    translationKey: 'hero.slides.2'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  setupPage(renderPage);
});

async function renderPage() {
  document.title = t('meta.homeTitle');
  renderHeroSlider();
  await renderLatestUpdates();
  await renderAgenda();
  renderVisionMission();
}

function renderHeroSlider(activeIndex = 0) {
  const sliderRoot = qs('#hero-slider');
  const slides = heroSlides
    .map((slide) => {
      const copy = getSlideCopy(slide.translationKey);
      return `
        <div class="hero__slide ${slide.className}">
          <div class="hero__media"></div>
          <div class="hero__overlay"></div>
          <div class="hero__content">
            <div class="hero__content-inner">
              <div class="hero__eyebrow">
                <span>${t('brand.name')}</span>
                <span>${t('navbar.kemitraan')}</span>
              </div>
              <h1 class="hero__title">${copy.headline}</h1>
              <p class="hero__subtitle">${copy.subheadline}</p>
              <div class="hero__tags">
                ${copy.points.map((point) => `<span class="hero__tag">${point}</span>`).join('')}
              </div>
              <div class="hero__cta">
                <a class="btn primary" href="./articles.html">${t('hero.ctaArticles')}</a>
                <a class="btn secondary" href="./contact.html">${t('hero.ctaContact')}</a>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  const dots = heroSlides
    .map(
      (_, idx) => `<button class="hero__dot${idx === activeIndex ? ' is-active' : ''}" data-index="${idx}" aria-label="Slide ${idx + 1}"></button>`
    )
    .join('');

  setHTML(
    sliderRoot,
    `
    <div class="hero__slides" style="transform: translateX(-${activeIndex * 100}%);">
      ${slides}
    </div>
    <div class="hero__controls">
      <div class="hero__dots">${dots}</div>
      <div class="hero__nav">
        <button type="button" data-hero-prev aria-label="Sebelumnya">‹</button>
        <button type="button" data-hero-next aria-label="Berikutnya">›</button>
      </div>
    </div>
  `
  );

  bindHeroControls(activeIndex);
}

function bindHeroControls(activeIndex) {
  const slidesContainer = qs('.hero__slides');
  let current = activeIndex;

  const goTo = (index) => {
    current = (index + heroSlides.length) % heroSlides.length;
    slidesContainer.style.transform = `translateX(-${current * 100}%)`;
    document.querySelectorAll('.hero__dot').forEach((dot) => {
      dot.classList.toggle('is-active', Number(dot.dataset.index) === current);
    });
  };

  qs('[data-hero-prev]')?.addEventListener('click', () => goTo(current - 1));
  qs('[data-hero-next]')?.addEventListener('click', () => goTo(current + 1));
  document.querySelectorAll('.hero__dot').forEach((dot) => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
  });
}

function getSlideCopy(key) {
  const copy = t(key);
  if (copy && typeof copy === 'object') return copy;
  return { headline: '', subheadline: '', points: [] };
}

async function renderLatestUpdates() {
  const target = qs('#latest-updates-list');
  try {
    const [news, articles] = await Promise.all([
      loadJSON(new URL('../data/news.json', import.meta.url).href),
      loadJSON(new URL('../data/articles.json', import.meta.url).href)
    ]);

    const normalized = [
      ...news.map((item) => ({ ...item, type: 'news' })),
      ...articles.map((item) => ({ ...item, type: 'article' }))
    ];

    const latest = sortByDateDesc(normalized, 'date').slice(0, 6);

    if (!latest.length) {
      setHTML(target, `<p data-i18n="articles.empty">${t('articles.empty')}</p>`);
      return;
    }

    const markup = latest.map((item) => renderContentCard(item)).join('');
    setHTML(target, markup);
  } catch (error) {
    console.error('Failed to load updates:', error);
    setHTML(target, `<p class="error-message">Gagal memuat berita terbaru. Silakan coba muat ulang halaman.</p>`);
  }
}

async function renderAgenda() {
  const target = qs('#agenda-list');
  try {
    const events = await loadJSON(new URL('../data/events.json', import.meta.url).href);
    const upcoming = filterUpcomingEvents(events).slice(0, 3);

    if (!upcoming.length) {
      setHTML(target, `<p data-i18n="events.empty">${t('events.empty')}</p>`);
      return;
    }

    const cards = upcoming
      .map(
        (event) => `
        <article class="card agenda-card">
          <div class="agenda-meta">
            <span class="badge">${event.type}</span>
            <span>${formatDate(event.dateStart, monthNames)}${
          event.dateEnd ? ' - ' + formatDate(event.dateEnd, monthNames) : ''
        }</span>
            ${event.location ? `<span>${event.location}</span>` : ''}
          </div>
          <h3>${event.title}</h3>
          <p class="muted">${event.excerpt || ''}</p>
        </article>
      `
      )
      .join('');

    setHTML(target, cards);
  } catch (error) {
    setHTML(target, `<p>${error.message}</p>`);
  }
}

function renderVisionMission() {
  const list = qs('#misi-list');
  const missions = t('vision.misi') || [];
  setHTML(
    list,
    missions.map((item) => `<li>${item}</li>`).join('')
  );
}
