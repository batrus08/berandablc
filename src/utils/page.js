import { mountLayout } from '../components/Layout.js';
import { applyTranslations, initI18n, onLanguageChange } from './i18n.js';

/**
 * Shared bootstrapper to ensure language assets are loaded, layout is mounted,
 * and translations are applied before page-specific rendering runs.
 * @param {() => (void|Promise<void>)} renderCallback
 * @param {{ defaultLang?: string, rerenderOnLanguageChange?: boolean }} options
 */
export async function setupPage(renderCallback, options = {}) {
  const { defaultLang = 'id', rerenderOnLanguageChange = true } = options;

  await initI18n(defaultLang);
  mountLayout();

  if (typeof renderCallback === 'function') {
    await renderCallback();
  }

  applyTranslations();

  if (rerenderOnLanguageChange) {
    onLanguageChange(async () => {
      mountLayout();
      if (typeof renderCallback === 'function') {
        await renderCallback();
      }
      applyTranslations();
    });
  }
}
