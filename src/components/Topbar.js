import { getCurrentLanguage, setLanguage, t } from '../utils/i18n.js';

const icons = {
  facebook:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 10.5V8.75c0-.69.56-1.25 1.25-1.25H16V5h-2.25A3.75 3.75 0 0 0 10 8.75v1.75H8v2.5h2v6h2.5v-6H16l.5-2.5h-3z" fill="currentColor"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7zm9.25.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5z" fill="currentColor"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 9.5V18H4.2V9.5h2.74zM5.57 5a1.59 1.59 0 1 1 0 3.18 1.59 1.59 0 0 1 0-3.18zM19.8 18h-2.73v-4.3c0-1.07-.38-1.8-1.35-1.8-.74 0-1.18.5-1.38.98-.07.17-.09.41-.09.65V18h-2.73s.04-7.57 0-8.5h2.73v1.2c.36-.56 1-1.36 2.42-1.36 1.76 0 3.13 1.15 3.13 3.62z" fill="currentColor"/></svg>',
  youtube:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.2-.9-3.1-.2-7.6-.2-7.6-.2h-.1s-4.5 0-7.6.2c-.6.1-1.4.1-2.2.9-.6.6-.8 2-.8 2S0 8.8 0 10.4v1.2c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.6.2 7.4.2 7.4.2s4.5 0 7.6-.2c.6-.1 1.4-.1 2.2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.2c0-1.6-.2-3.2-.2-3.2zM9.5 13.8V8.9l5.2 2.5z" fill="currentColor"/></svg>'
};

function renderSocialIcon(href, label, iconName) {
  return `<a class="topbar__icon" href="${href}" aria-label="${label}" target="_blank" rel="noreferrer">${icons[iconName]}</a>`;
}

function renderLanguageSwitcher() {
  const lang = getCurrentLanguage();
  return `
    <div class="language-switch" role="group" aria-label="Language switcher">
      <button class="language-switch__btn${lang === 'id' ? ' is-active' : ''}" data-lang="id">${t('topbar.language')}</button>
      <button class="language-switch__btn${lang === 'en' ? ' is-active' : ''}" data-lang="en">${t('topbar.languageAlt')}</button>
    </div>
  `;
}

export function renderTopbar() {
  return `
    <div class="topbar" aria-label="Topbar">
      <div class="topbar__inner container">
        <div class="topbar__social" aria-label="Social media">
          ${renderSocialIcon('https://facebook.com', 'Facebook', 'facebook')}
          ${renderSocialIcon('https://instagram.com', 'Instagram', 'instagram')}
          ${renderSocialIcon('https://linkedin.com', 'LinkedIn', 'linkedin')}
          ${renderSocialIcon('https://youtube.com', 'YouTube', 'youtube')}
        </div>
        ${renderLanguageSwitcher()}
      </div>
    </div>
  `;
}

export function bindTopbar() {
  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', async () => {
      await setLanguage(button.dataset.lang);
      document.querySelectorAll('.language-switch__btn').forEach((el) => {
        el.classList.toggle('is-active', el.dataset.lang === getCurrentLanguage());
      });
    });
  });
}
