import { renderNavbar } from './Navbar.js';

export function renderHeader() {
  return `
    <header class="site-header">
      <div class="container site-header__inner">
        <div class="site-header__branding">
          <div class="logo" aria-hidden="true">BLC</div>
          <div>
            <p class="eyebrow">Business Law Community</p>
            <p class="site-header__tagline">Kampus Fakultas Hukum</p>
          </div>
        </div>
        ${renderNavbar()}
      </div>
    </header>
  `;
}
