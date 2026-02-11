import { formatDate } from '../utils/helpers.js';

export function renderNewsCard(item) {
  return `
    <article class="content-card content-card--news" tabindex="0">
      <div class="content-card__badge">${item.category}</div>
      <div class="content-card__body">
        <h3 class="content-card__title">
          <a href="${item.slug}" aria-label="Baca ${item.title}">${item.title}</a>
        </h3>
        <div class="content-card__meta">${formatDate(item.date)}${item.author ? ` • ${item.author}` : ''}</div>
        <p class="content-card__excerpt">${item.excerpt}</p>
        <a class="content-card__cta" href="${item.slug}">Baca Selengkapnya</a>
      </div>
    </article>
  `;
}
