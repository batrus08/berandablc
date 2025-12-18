import { formatDate } from '../utils/helpers.js';
import { getCurrentLanguage, t } from '../utils/i18n.js';

const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getMonthNames() {
  return getCurrentLanguage() === 'en' ? monthNamesEn : undefined;
}

export function renderContentCard(item) {
  const monthNames = getMonthNames();
  return `
    <article class="content-card" tabindex="0">
      <div class="content-card__badge">${item.category || item.categoryType || ''}</div>
      <div class="content-card__body">
        <h3 class="content-card__title">
          <a href="${item.slug || '#'}" aria-label="${t('articles.title')}">${item.title}</a>
        </h3>
        <div class="content-card__meta">${formatDate(item.date, monthNames)}${item.author ? ` • ${item.author.name || item.author}` : ''}</div>
        <p class="content-card__excerpt">${item.excerpt}</p>
        <div class="content-card__cta-row">
          <a class="content-card__cta" href="${item.slug || '#'}">${t('hero.ctaArticles')}</a>
        </div>
      </div>
    </article>
  `;
}
