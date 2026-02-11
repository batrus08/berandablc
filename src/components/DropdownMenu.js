const sanitizeId = (value) => value.toLowerCase().replace(/\s+/g, '-');

let globalSubmenuIndex = 0;

// Chevron pointing right (default state)
const CHEVRON_SVG = `
<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="chevron-icon">
  <path d="M9 18l6-6-6-6"/>
</svg>
`;

function renderDropdownItems(items = [], depth = 0, parentId = 'root') {
  return items
    .map((item) => {
      if (item.children?.length) {
        const submenuId = `${parentId}-submenu-${globalSubmenuIndex++}`;
        const childItems = renderDropdownItems(item.children, depth + 1, submenuId);
        const parentClasses = [
          'dropdown__item',
          'dropdown__item--toggle',
          depth > 0 ? 'dropdown__item--child' : 'dropdown__item--parent',
        ]
          .filter(Boolean)
          .join(' ');

        return `
          <div class="dropdown__group dropdown__group--level-${depth}" data-dropdown-level="${depth}">
            <button
              class="${parentClasses}"
              type="button"
              aria-expanded="false"
              aria-controls="${submenuId}"
              data-submenu-trigger
            >
              <span class="dropdown__label">${item.text}</span>
              <span class="dropdown__chevron" aria-hidden="true">${CHEVRON_SVG}</span>
            </button>
            <div class="dropdown__submenu dropdown__submenu--level-${depth}" id="${submenuId}" hidden>
              ${childItems}
            </div>
          </div>
        `;
      }

      const itemClass = depth > 0 ? 'dropdown__item dropdown__item--child' : 'dropdown__item';
      return `<a class="${itemClass}" href="${item.href}">${item.text}</a>`;
    })
    .join('');
}

export function renderDropdownMenu(label, items = []) {
  globalSubmenuIndex = 0;
  const id = `dropdown-${sanitizeId(label)}`;
  const links = renderDropdownItems(items);

  return `
    <li class="nav-item">
      <button class="nav-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="${id}" data-dropdown>
        <span>${label}</span>
        <span class="nav-trigger__chevron" aria-hidden="true">${CHEVRON_SVG}</span>
      </button>
      <div class="dropdown" id="${id}" role="menu" hidden>
        ${links}
      </div>
    </li>
  `;
}
