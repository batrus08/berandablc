import { fetchJson } from '../lib/wpClient';
import { ContentItem, PaginatedResult } from '../types/content';

interface WPItem {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  link?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
  };
}

const DEFAULT_PER_PAGE = 10;
const DBS_CATEGORY_SLUG = 'dbs';

const extractFeaturedImage = (item: WPItem) => {
  return item._embedded?.['wp:featuredmedia']?.[0]?.source_url;
};

const normalize = (item: WPItem, type: 'article' | 'agenda'): ContentItem => ({
  id: item.id,
  slug: item.slug,
  title: item.title?.rendered ?? 'Tanpa judul',
  excerpt: item.excerpt?.rendered ?? '',
  content: item.content?.rendered ?? '',
  date: item.date,
  featuredImageUrl: extractFeaturedImage(item),
  link: item.link,
  type
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
    items: data.map((item) => normalize(item, 'article')),
    totalPages: totalPages ?? 1
  };
};

export const getAgenda = async (
  page = 1,
  perPage = DEFAULT_PER_PAGE
): Promise<PaginatedResult<ContentItem>> => {
  const { data, totalPages } = await fetchJson<WPItem[]>('/wp-json/wp/v2/agenda', {
    page,
    per_page: perPage,
    _embed: 1
  });
  return {
    items: data.map((item) => normalize(item, 'agenda')),
    totalPages: totalPages ?? 1
  };
};

export const getBySlug = async (
  type: 'posts' | 'agenda',
  slug: string
): Promise<ContentItem | null> => {
  const { data } = await fetchJson<WPItem[]>(`/wp-json/wp/v2/${type}`, {
    slug,
    per_page: 1,
    _embed: 1
  });
  if (!data || data.length === 0) return null;
  return normalize(data[0], type === 'posts' ? 'article' : 'agenda');
};
