import { renderDropdownMenu } from './DropdownMenu.js';
import { qsa } from '../utils/dom.js';
import { t } from '../utils/i18n.js';

const readableFallbacks = ['Teks belum tersedia', 'Text not available'];

function resolveLabel(key, fallback) {
  const value = t(key);
  if (!value) return fallback;
  return readableFallbacks.includes(value) ? fallback : value;
}

const p = (path) => new URL(path, import.meta.url).href;

const menuConfig = () => [
  { label: t('navbar.beranda'), href: p('../pages/index.html') },
  {
    label: t('navbar.tentang'),
    items: [
      { text: t('aboutMenu.profile'), href: p('../pages/tentang-kami/profil.html') },
      { text: t('aboutMenu.sejarah'), href: p('../pages/tentang-kami/sejarah.html') },
      { text: t('aboutMenu.visiMisi'), href: p('../pages/tentang-kami/visi-misi.html') },
      {
        text: t('aboutMenu.manajemen'),
        href: p('../pages/tentang-kami/manajemen/index.html'),
        children: [
          { text: t('aboutMenu.bph'), href: p('../pages/tentang-kami/manajemen/bph.html') },
          {
            text: resolveLabel('aboutMenu.divisi', 'Divisi'),
            href: p('../pages/tentang-kami/manajemen/divisi.html'),
            children: [
              {
                text: resolveLabel('aboutMenu.operasional', 'Operasional'),
                href: p('../pages/tentang-kami/manajemen/divisi.html#direktorat-operasional')
              },
              {
                text: resolveLabel('aboutMenu.akademik', 'Akademik'),
                href: p('../pages/tentang-kami/manajemen/divisi.html#direktorat-akademik')
              }
            ]
          }
        ]
      }
    ]
  },
  { label: t('navbar.artikel'), href: p('../pages/articles.html') },
  { label: t('navbar.kegiatan'), href: p('../pages/events.html') },
  { label: t('navbar.kerjaSama'), href: p('../pages/partnership.html#program') },
  { label: t('navbar.galeri'), href: p('../pages/gallery.html') },
  { label: t('navbar.kontak'), href: p('../pages/contact.html') }
];

function normalizePath(url) {
  try {
    const { pathname } = new URL(url, window.location.origin);
    const withoutIndex = pathname.replace(/index\.html$/, '');
    if (withoutIndex.length > 1 && withoutIndex.endsWith('/')) {
      return withoutIndex.slice(0, -1);
    }
    return withoutIndex || '/';
  } catch (error) {
    return url;
  }
}

function markActiveNav(navbar) {
  // Use window.location.href to be robust against deployment paths
  const currentPath = normalizePath(window.location.href);
  const navItems = qsa('.nav-item', navbar);
  const links = qsa('a.nav-link, a.dropdown__item', navbar);

  links.forEach((link) => {
    const linkPath = normalizePath(link.getAttribute('href') || link.href);
    const isActive =
      currentPath === linkPath ||
      (linkPath !== '/' && linkPath !== '/src/pages' && currentPath.startsWith(linkPath));
    link.classList.toggle('is-active', Boolean(isActive));
  });

  navItems.forEach((item) => {
    const hasActiveLink = qsa('a', item).some((link) => link.classList.contains('is-active'));
    item.classList.toggle('is-active', hasActiveLink);
    const trigger = item.querySelector('.nav-trigger');
    if (trigger) {
      trigger.classList.toggle('is-active', hasActiveLink);
    }
  });
}

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
        <a class="brand" href="${p('../pages/index.html')}">
          <span class="src/assets/images/logo.png">LC</span>
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
  const submenuTriggers = qsa('[data-submenu-trigger]', scope);
  const navbar = scope.querySelector('.navbar');
  const toggle = navbar?.querySelector('.navbar__toggle');
  const menu = navbar?.querySelector('.navbar__menu');
  const backdrop = navbar?.querySelector('[data-nav-backdrop]');
  const navLinks = qsa('.nav-link', navbar);
  const dropdownLinks = qsa('.dropdown__item', navbar);

  function closeAllSubmenus() {
    submenuTriggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.closest('.dropdown__group')?.classList.remove('expanded');
      const submenuEl = scope.querySelector(`#${trigger.getAttribute('aria-controls')}`);
      if (submenuEl) {
        submenuEl.classList.remove('open');
        submenuEl.setAttribute('hidden', '');
      }
    });
  }

  function closeAllDropdowns() {
    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.closest('.nav-item')?.classList.remove('expanded');
      const menuEl = trigger.nextElementSibling;
      if (menuEl) {
        menuEl.classList.remove('open');
        menuEl.setAttribute('hidden', '');
      }
    });
    closeAllSubmenus();
  }

  function closeMenu() {
    if (toggle && menu) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      backdrop?.classList.remove('active');
      closeAllDropdowns();
    }
  }

  const closeSiblingSubmenus = (currentTrigger) => {
    const currentGroup = currentTrigger.closest('.dropdown__group');
    if (!currentGroup) return;
    const container = currentGroup.parentElement;
    if (!container) return;
    qsa('[data-submenu-trigger]', container).forEach((trigger) => {
      if (trigger === currentTrigger) return;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.closest('.dropdown__group')?.classList.remove('expanded');
      const submenu = scope.querySelector(`#${trigger.getAttribute('aria-controls')}`);
      if (submenu) {
        submenu.classList.remove('open');
        submenu.setAttribute('hidden', '');
      }
    });
  };

  const closeDescendants = (group) => {
    qsa('[data-submenu-trigger]', group).forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.closest('.dropdown__group')?.classList.remove('expanded');
      const submenu = scope.querySelector(`#${trigger.getAttribute('aria-controls')}`);
      if (submenu) {
        submenu.classList.remove('open');
        submenu.setAttribute('hidden', '');
      }
    });
  };

  triggers.forEach((trigger) => {
    const menuEl = trigger.nextElementSibling;
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      closeAllDropdowns();
      const willOpen = !isOpen;
      trigger.setAttribute('aria-expanded', String(willOpen));
      trigger.closest('.nav-item')?.classList.toggle('expanded', willOpen);
      menuEl?.classList.toggle('open', willOpen);
      menuEl?.toggleAttribute('hidden', !willOpen);
      if (!willOpen) {
        closeDescendants(menuEl);
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

  submenuTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const submenu = scope.querySelector(`#${trigger.getAttribute('aria-controls')}`);
      if (!submenu) return;

      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      const willOpen = !isOpen;

      closeSiblingSubmenus(trigger);

      trigger.setAttribute('aria-expanded', String(willOpen));
      trigger.closest('.dropdown__group')?.classList.toggle('expanded', willOpen);
      submenu.classList.toggle('open', willOpen);
      submenu.toggleAttribute('hidden', !willOpen);

      if (!willOpen) {
        closeDescendants(submenu);
      }
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        trigger.setAttribute('aria-expanded', 'false');
        const submenu = scope.querySelector(`#${trigger.getAttribute('aria-controls')}`);
        trigger.closest('.dropdown__group')?.classList.remove('expanded');
        submenu?.classList.remove('open');
        submenu?.setAttribute('hidden', '');
        trigger.focus();
      }
    });
  });

  markActiveNav(navbar);

  globalNavCleanup = () => {
    document.removeEventListener('click', handleDocumentClick);
    document.removeEventListener('keydown', handleDocumentKeydown);
    window.removeEventListener('resize', handleResize);
  };
}
