const cache = {};
let currentLang = 'id';
const listeners = [];

export function resolveKey(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return acc[part];
    }
    return undefined;
  }, obj);
}

async function fetchDictionary(lang) {
  if (cache[lang]) return cache[lang];
  try {
    const response = await fetch(`../i18n/${lang}.json`);
    if (!response.ok) throw new Error(`Gagal memuat terjemahan (${lang})`);
    cache[lang] = await response.json();
    return cache[lang];
  } catch (error) {
    console.error(`Failed to load dictionary for ${lang}:`, error);
    return {}; // Return empty object to prevent crashes
  }
}

export function t(key) {
  const dict = cache[currentLang];
  // If dict is not loaded yet, return key.
  if (!dict) return key;

  const value = resolveKey(dict, key);
  // If value is null/undefined, return key.
  // If it's an empty string, we return it (as it might be intentional).
  return value !== undefined && value !== null ? value : key;
}

export function getCurrentLanguage() {
  return currentLang;
}

export async function setLanguage(lang) {
  await fetchDictionary(lang);
  currentLang = lang;
  localStorage.setItem('language', lang);
  applyTranslations();
  listeners.forEach((fn) => fn(lang));
}

export async function initI18n(defaultLang = 'id') {
  const saved = localStorage.getItem('language');
  const lang = saved || defaultLang;
  await setLanguage(lang);
}

export function onLanguageChange(callback) {
  listeners.push(callback);
}

export function applyTranslations(scope = document) {
  scope.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const translation = t(key);
    // Only update if translation is different from key (or if we want to force update)
    // Actually we should always update because the key is the fallback.

    if (el.dataset.i18nAttr) {
      el.setAttribute(el.dataset.i18nAttr, translation);
    } else {
      el.textContent = translation;
    }
  });

  scope.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    const translation = t(key);
    if (translation && translation !== key) {
      el.innerHTML = translation;
    }
  });
}
