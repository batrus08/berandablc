export function renderSectionTitle({ eyebrow, title, subtitle }) {
  return `
    <div class="section-header">
      <div>
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
        <h2>${title}</h2>
        ${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ''}
      </div>
    </div>
  `;
}
