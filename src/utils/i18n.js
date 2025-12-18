const cache = {};
let currentLang = 'id';
let defaultLanguage = 'id';
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

// Use an absolute base so nested routes (e.g. /tentang-kami/profil.html)
// consistently resolve the locale JSON.
const dictionaryBase = new URL('/i18n/', window.location.origin);

function hasEntries(obj) {
  return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
}

async function fetchDictionary(lang) {
  if (cache[lang]) return cache[lang];
  try {
    const dictionaryUrl = new URL(`${lang}.json`, dictionaryBase);
    const response = await fetch(dictionaryUrl);
    if (!response.ok) throw new Error(`Gagal memuat terjemahan (${lang})`);
    cache[lang] = await response.json();
    return cache[lang];
  } catch (error) {
    console.error(`Failed to load dictionary for ${lang}:`, error);
    return null; // Return null so we can trigger a fallback instead of showing raw keys
  }
}

export function t(key) {
  const dict = cache[currentLang];
  const fallbackDict = cache[defaultLanguage];
  // If dict is not loaded yet, return key.
  if (!dict) return key;

  const value = resolveKey(dict, key);
  if (value !== undefined && value !== null) return value;

  const fallbackValue = resolveKey(fallbackDict, key);
  if (fallbackValue !== undefined && fallbackValue !== null) return fallbackValue;
  // If value is null/undefined, return key.
  // If it's an empty string, we return it (as it might be intentional).
  return key;
}

export function getCurrentLanguage() {
  return currentLang;
}

export async function setLanguage(lang) {
  const dictionary = await fetchDictionary(lang);

  if (!hasEntries(dictionary)) {
    console.warn(`Dictionary for ${lang} is missing or empty. Falling back to ${defaultLanguage}.`);
    currentLang = defaultLanguage;
    await fetchDictionary(defaultLanguage);
  } else {
    currentLang = lang;
  }

  localStorage.setItem('language', currentLang);
  applyTranslations();
  listeners.forEach((fn) => fn(lang));
}

export async function initI18n(defaultLang = 'id') {
  defaultLanguage = defaultLang;
  const saved = localStorage.getItem('language');
  const lang = saved || defaultLang;

  // Always ensure the default dictionary is ready so we can fall back gracefully.
  await fetchDictionary(defaultLanguage);
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
