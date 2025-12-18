import { renderDropdownMenu } from './DropdownMenu.js';
import { qsa } from '../utils/dom.js';
import { t } from '../utils/i18n.js';

const menuConfig = () => [
  { label: t('navbar.beranda'), href: './index.html' },
  {
    label: t('navbar.tentang'),
    items: [
      { text: t('navbar.tentang'), href: './about.html' },
      { text: t('vision.title'), href: './about.html#visi-misi' },
    ],
  },
  { label: t('navbar.artikel'), href: './articles.html' },
  { label: t('navbar.kegiatan'), href: './events.html' },
  { label: t('navbar.divisi'), href: './divisions.html' },
  { label: t('navbar.kerjaSama'), href: './partnership.html#program' },
  { label: t('navbar.galeri'), href: './gallery.html' },
  { label: t('navbar.kontak'), href: './contact.html' }
];

export function renderNavbar() {
  const navItems = menuConfig()
    .map((menu) => {
      if (menu.items) {
        return renderDropdownMenu(menu.label, menu.items);
      }
      return `<li class="nav-item"><a class="nav-link" href="${menu.href}">${menu.label}</a></li>`;
    })
    .join('');

  return `
    <nav class="navbar" aria-label="Navigasi utama">
      <div class="container navbar__inner">
        <a class="brand" href="./index.html">
          <span class="brand__mark">LC</span>
          <span class="brand__text">
            <span class="brand__name">${t('brand.name')}</span>
            <span class="brand__subtitle">${t('brand.university')}</span>
          </span>
        </a>
        <button class="navbar__toggle" aria-expanded="false" aria-label="Toggle navigasi"><span></span></button>
        <div class="navbar__menu" role="menubar">
          <ul class="nav-list">
            ${navItems}
          </ul>
        </div>
      </div>
      <div class="navbar__backdrop" data-nav-backdrop></div>
    </nav>
  `;
}

let globalNavCleanup;

export function bindNavigation(scope = document) {
  if (typeof globalNavCleanup === 'function') {
    globalNavCleanup();
  }

  const triggers = qsa('[data-dropdown]', scope);
  const navbar = scope.querySelector('.navbar');
  const toggle = navbar?.querySelector('.navbar__toggle');
  const menu = navbar?.querySelector('.navbar__menu');
  const backdrop = navbar?.querySelector('[data-nav-backdrop]');
  const navLinks = qsa('.nav-link', navbar);
  const dropdownLinks = qsa('.dropdown__item', navbar);

  function closeAllDropdowns() {
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.closest('.nav-item')?.classList.remove('expanded');
      const menuEl = trigger.nextElementSibling;
      if (menuEl) menuEl.classList.remove('open');
    });
  }

  function closeMenu() {
    if (toggle && menu) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      backdrop?.classList.remove('active');
      closeAllDropdowns();
    }
  }

  triggers.forEach((trigger) => {
    const menuEl = trigger.nextElementSibling;
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      const isMobile = window.matchMedia('(max-width: 960px)').matches;

      closeAllDropdowns();
      const willOpen = !isOpen;
      trigger.setAttribute('aria-expanded', String(willOpen));
      trigger.closest('.nav-item')?.classList.toggle('expanded', willOpen);
      if (!isMobile) {
        menuEl?.classList.toggle('open', willOpen);
      }
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger.click();
      }
      if (event.key === 'Escape') {
        closeAllDropdowns();
        trigger.focus();
      }
    });
  });

  const handleDocumentClick = (event) => {
    if (!event.target.closest('.nav-item') && !event.target.closest('.navbar__toggle')) {
      closeAllDropdowns();
    }
  };
  document.addEventListener('click', handleDocumentClick);

  const handleDocumentKeydown = (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  };
  document.addEventListener('keydown', handleDocumentKeydown);

  toggle?.addEventListener('click', () => {
    if (!menu) return;
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('open', !isOpen);
    backdrop?.classList.toggle('active', !isOpen);
    if (!isOpen) {
      closeAllDropdowns();
    }
  });

  backdrop?.addEventListener('click', closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 960) closeMenu();
    });
  });

  dropdownLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 960) closeMenu();
    });
  });

  const handleResize = () => {
    if (window.innerWidth > 960) {
      backdrop?.classList.remove('active');
      menu?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  };
  window.addEventListener('resize', handleResize);

  globalNavCleanup = () => {
    document.removeEventListener('click', handleDocumentClick);
    document.removeEventListener('keydown', handleDocumentKeydown);
    window.removeEventListener('resize', handleResize);
  };
}
