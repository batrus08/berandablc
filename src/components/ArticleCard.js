import { formatDate } from '../utils/helpers.js';

export function renderArticleCard(item) {
  return `
    <article class="card article-card">
      <div class="badge">${item.categoryType}</div>
      <h3 class="card__title"><a class="article-card__link" href="./articles.html?slug=${item.slug}">${item.title}</a></h3>
      <div class="card__meta">
        <span>${formatDate(item.date)}</span>
        <span>• ${item.author.name} (${item.author.affiliation})</span>
      </div>
      <p class="muted card__excerpt">${item.excerpt}</p>
      <div class="article-card__footer">
        <div class="list-inline">${item.topics.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
        <a class="link-arrow" href="./articles.html?slug=${item.slug}">Baca</a>
      </div>
    </article>
  `;
}
