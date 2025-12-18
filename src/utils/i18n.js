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

// Resolve dictionary files while being resilient to different hosting layouts.
// We probe common static locations (root-level /i18n or /public/i18n) and also
// climb up the current path to try sibling "public" or "src" folders so pages
// served from nested directories (e.g. /src/pages) can still locate the JSON
// dictionaries.
function getDictionaryUrls(lang) {
  const { origin, pathname, href } = window.location;
  const candidateBases = [];

  // Always start with the origin-level fallbacks.
  const absoluteBases = ['/i18n/', '/public/i18n/', '/src/i18n/'];
  absoluteBases.forEach((base) => candidateBases.push(new URL(base, origin)));

  // Walk up the current path (excluding the file name) and try common sibling
  // folders at each level: i18n/, public/i18n/, src/i18n/.
  const segments = pathname.split('/').filter(Boolean);
  while (segments.length) {
    const ancestor = `/${segments.join('/')}/`;
    ['i18n/', 'public/i18n/', 'src/i18n/'].forEach((suffix) => {
      candidateBases.push(new URL(suffix, `${origin}${ancestor}`));
    });
    segments.pop();
  }

  // Paths relative to the current page (covers static file viewing scenarios).
  ['.', '..', '../..'].forEach((relativeBase) => {
    ['i18n/', 'public/i18n/', 'src/i18n/'].forEach((suffix) => {
      candidateBases.push(new URL(`${relativeBase}/${suffix}`, href));
    });
  });

  const seen = new Set();
  const uniqueUrls = [];

  candidateBases.forEach((base) => {
    const hrefWithFile = new URL(`${lang}.json`, base).href;
    if (!seen.has(hrefWithFile)) {
      seen.add(hrefWithFile);
      uniqueUrls.push(hrefWithFile);
    }
  });

  return uniqueUrls;
}
const HUMAN_FALLBACK = {
  id: 'Teks belum tersedia',
  en: 'Text not available'
};

function hasEntries(obj) {
  return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
}

async function fetchDictionary(lang) {
  if (cache[lang]) return cache[lang];
  if (!fetchDictionary.inFlight) fetchDictionary.inFlight = {};
  if (fetchDictionary.inFlight[lang]) return fetchDictionary.inFlight[lang];

  const fetchPromise = (async () => {
    for (const url of getDictionaryUrls(lang)) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;
        cache[lang] = await response.json();
        return cache[lang];
      } catch (error) {
        console.warn(`Failed to load dictionary for ${lang} from ${url}:`, error);
      }
    }

    console.error(`Dictionary for ${lang} is not reachable from any known path.`);
    return null; // Return null so we can trigger a fallback instead of showing raw keys
  })();

  fetchDictionary.inFlight[lang] = fetchPromise;
  const result = await fetchPromise;
  delete fetchDictionary.inFlight[lang];
  return result;
}

export function t(key) {
  const dict = cache[currentLang];
  const fallbackDict = cache[defaultLanguage];

  const value = resolveKey(dict, key);
  if (value !== undefined && value !== null) return value;

  const fallbackValue = resolveKey(fallbackDict, key);
  if (fallbackValue !== undefined && fallbackValue !== null) return fallbackValue;
  // If value is null/undefined, return a human-friendly fallback instead of the raw key.
  const readableFallback = HUMAN_FALLBACK[currentLang] || HUMAN_FALLBACK[defaultLanguage];
  return readableFallback || 'Text unavailable';
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
