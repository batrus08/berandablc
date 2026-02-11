export interface WpAgendaItem {
  id: number;
  slug: string;
  date: string;
  link?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  poster_url?: string;
  minutes_url?: string;
  report_url?: string;
  start_date?: string;
  end_date?: string;
  time?: string;
  location?: string;
  register_url?: string;
}

interface WpListResponse<T> {
  items: T[];
  totalPages: number;
}

const CMS_BASE_URL = (
  import.meta.env.VITE_CMS_BASE_URL ||
  import.meta.env.VITE_WP_BASE_URL ||
  ''
).replace(/\/$/, '');

const REQUEST_TIMEOUT_MS = 8000;

if (!CMS_BASE_URL) {
  console.warn('VITE_CMS_BASE_URL belum diset. Data WordPress akan memakai fallback kosong.');
}

const buildEndpoint = (path: string, params: Record<string, string | number | undefined> = {}) => {
  const base = CMS_BASE_URL || window.location.origin;
  const url = new URL(path, base);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

const fetchFromWp = async <T>(
  path: string,
  params: Record<string, string | number | undefined> = {}
): Promise<WpListResponse<T>> => {
  if (!CMS_BASE_URL) {
    return { items: [], totalPages: 1 };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(buildEndpoint(path, params), {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as T[];
    const totalPages = Number(response.headers.get('X-WP-TotalPages') || 1);

    return {
      items: Array.isArray(data) ? data : [],
      totalPages: Number.isFinite(totalPages) ? totalPages : 1
    };
  } catch (error) {
    console.warn('Gagal mengambil data WordPress:', error);
    return { items: [], totalPages: 1 };
  } finally {
    clearTimeout(timeout);
  }
};

export const getAgendas = async (page = 1, perPage = 10) => {
  return fetchFromWp<WpAgendaItem>('/wp-json/wp/v2/agenda', {
    page,
    per_page: perPage,
    _embed: 1,
    orderby: 'meta_value',
    meta_key: 'start_date',
    order: 'asc'
  });
};

export const getNews = async () => {
  return fetchFromWp<unknown>('/wp-json/wp/v2/posts', { per_page: 6 });
};

export const getArticles = async (page = 1, perPage = 10) => {
  return fetchFromWp<unknown>('/wp-json/wp/v2/posts', { page, per_page: perPage, _embed: 1 });
};

export const getGallery = async () => {
  return fetchFromWp<unknown>('/wp-json/wp/v2/media', { per_page: 12 });
};
