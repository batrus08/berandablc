import { fetchJson } from '../lib/wpClient';
import { AgendaItem, ContentItem, PaginatedResult } from '../types/content';

interface WPItem {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  link?: string;
  meta?: {
    start_date?: string;
    end_date?: string;
    time?: string;
    location?: string;
    register_url?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
  };
}

const DEFAULT_PER_PAGE = 10;
const DBS_CATEGORY_SLUG = 'dbs';

const extractFeaturedImage = (item: WPItem) => {
  return item._embedded?.['wp:featuredmedia']?.[0]?.source_url;
};

const normalizeArticle = (item: WPItem): ContentItem => ({
  id: item.id,
  slug: item.slug,
  title: item.title?.rendered ?? 'Tanpa judul',
  excerpt: item.excerpt?.rendered ?? '',
  content: item.content?.rendered ?? '',
  date: item.date,
  featuredImageUrl: extractFeaturedImage(item),
  link: item.link,
  type: 'article'
});

const normalizeAgenda = (item: WPItem): AgendaItem => ({
  id: item.id,
  slug: item.slug,
  title: item.title?.rendered ?? 'Tanpa judul',
  excerpt: item.excerpt?.rendered ?? '',
  content: item.content?.rendered ?? '',
  date: item.date,
  featuredImageUrl: extractFeaturedImage(item),
  link: item.link,
  type: 'agenda',
  startDate: item.meta?.start_date ?? '',
  endDate: item.meta?.end_date ?? '',
  time: item.meta?.time ?? '',
  location: item.meta?.location ?? '',
  registerUrl: item.meta?.register_url ?? ''
});

const resolveCategoryId = async (slug: string): Promise<number | undefined> => {
  const { data } = await fetchJson<Array<{ id: number }>>('/wp-json/wp/v2/categories', {
    slug
  });
  return data?.[0]?.id;
};

export const getArticles = async (
  page = 1,
  perPage = DEFAULT_PER_PAGE
): Promise<PaginatedResult<ContentItem>> => {
  let categoryId: number | undefined;
  try {
    categoryId = await resolveCategoryId(DBS_CATEGORY_SLUG);
  } catch (error) {
    console.warn('Kategori DBS tidak ditemukan, mengambil semua artikel.', error);
  }

  const { data, totalPages } = await fetchJson<WPItem[]>('/wp-json/wp/v2/posts', {
    page,
    per_page: perPage,
    _embed: 1,
    ...(categoryId ? { categories: categoryId } : {})
  });
  return {
    items: data.map((item) => normalizeArticle(item)),
    totalPages: totalPages ?? 1
  };
};

export const getAgenda = async (
  page = 1,
  perPage = DEFAULT_PER_PAGE
): Promise<PaginatedResult<AgendaItem>> => {
  const { data, totalPages } = await fetchJson<WPItem[]>('/wp-json/wp/v2/agenda', {
    page,
    per_page: perPage,
    _embed: 1
  });
  return {
    items: data.map((item) => normalizeAgenda(item)),
    totalPages: totalPages ?? 1
  };
};

export const getBySlug = async (
  type: 'posts' | 'agenda',
  slug: string
): Promise<ContentItem | AgendaItem | null> => {
  const { data } = await fetchJson<WPItem[]>(`/wp-json/wp/v2/${type}`, {
    slug,
    per_page: 1,
    _embed: 1
  });
  if (!data || data.length === 0) return null;
  return type === 'posts' ? normalizeArticle(data[0]) : normalizeAgenda(data[0]);
};
