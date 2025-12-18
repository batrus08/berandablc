const cache = {};
let currentLang = 'id';
const listeners = [];

function resolveKey(obj, path) {
  return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

async function fetchDictionary(lang) {
  if (cache[lang]) return cache[lang];
  const response = await fetch(`../i18n/${lang}.json`);
  if (!response.ok) throw new Error(`Gagal memuat terjemahan (${lang})`);
  cache[lang] = await response.json();
  return cache[lang];
}

export function t(key) {
  const dict = cache[currentLang];
  const value = dict ? resolveKey(dict, key) : null;
  return value ?? key;
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
    if (el.dataset.i18nAttr) {
      el.setAttribute(el.dataset.i18nAttr, translation);
    } else {
      el.textContent = translation;
    }
  });

  scope.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    const translation = t(key);
    if (translation) {
      el.innerHTML = translation;
    }
  });
}
