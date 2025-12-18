const sanitizeId = (value) => value.toLowerCase().replace(/\s+/g, '-');

function renderDropdownItems(items = []) {
  return items
    .map((item) => {
      if (item.children?.length) {
        const childItems = item.children
          .map((child) => `<a class="dropdown__item dropdown__item--child" href="${child.href}">${child.text}</a>`)
          .join('');

        return `
          <div class="dropdown__group">
            <a class="dropdown__item dropdown__item--parent" href="${item.href}">${item.text}</a>
            <div class="dropdown__submenu">
              ${childItems}
            </div>
          </div>
        `;
      }

      return `<a class="dropdown__item" href="${item.href}">${item.text}</a>`;
    })
    .join('');
}

export function renderDropdownMenu(label, items = []) {
  const id = `dropdown-${sanitizeId(label)}`;
  const links = renderDropdownItems(items);

  return `
    <li class="nav-item">
      <button class="nav-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="${id}" data-dropdown>
        <span>${label}</span>
        <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <div class="dropdown" id="${id}" role="menu">
        ${links}
      </div>
    </li>
  `;
}
