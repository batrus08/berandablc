import { formatDate } from '../utils/helpers.js';
import { getCurrentLanguage, t } from '../utils/i18n.js';

function resolveLink(item) {
  if (item.type === 'article' || item.categoryType) {
    if (!item.slug) return '#';
    if (item.slug.startsWith('http')) return item.slug;
    return `./articles.html?slug=${encodeURIComponent(item.slug)}`;
  }

  if (item.type === 'news') {
    return item.permalink || item.slug || '#';
  }

  return item.slug || '#';
}

export function renderContentCard(item) {
  const locale = getCurrentLanguage() === 'id' ? 'id-ID' : 'en-US';
  const link = resolveLink(item);
  return `
    <article class="content-card" tabindex="0">
      <div class="content-card__badge">${item.category || item.categoryType || ''}</div>
      <div class="content-card__body">
        <h3 class="content-card__title">
          <a href="${link}" aria-label="${item.title}">${item.title}</a>
        </h3>
        <div class="content-card__meta">${formatDate(item.date, locale)}${item.author ? ` • ${item.author.name || item.author}` : ''}</div>
        <p class="content-card__excerpt">${item.excerpt}</p>
        <div class="content-card__cta-row">
          <a class="content-card__cta" href="${link}">${t('hero.ctaArticles')}</a>
        </div>
      </div>
    </article>
  `;
}
