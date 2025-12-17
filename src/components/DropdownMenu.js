export function renderDropdownMenu(label, items = []) {
  const id = `dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const links = items
    .map((item) => `<a class="dropdown__item" href="${item.href}">${item.text}</a>`) // simple items
    .join('');

  return `
    <li class="nav-item">
      <button class="nav-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="${id}" data-dropdown>
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
