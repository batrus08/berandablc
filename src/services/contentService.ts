import { fetchJson } from '../lib/wpClient';
import { AgendaItem, ContentItem, PageItem, PaginatedResult } from '../types/content';

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

const sectionCategoryMap = {
  kegiatan: import.meta.env.VITE_WP_CATEGORY_KEGIATAN_SLUG || 'kegiatan',
  kerjasama: import.meta.env.VITE_WP_CATEGORY_KERJASAMA_SLUG || 'kerjasama',
  galeri: import.meta.env.VITE_WP_CATEGORY_GALERI_SLUG || 'galeri'
} as const;

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
  type: 'article',
  sectionLabel: 'Artikel',
  detailPath: `/artikel/${item.slug}`
});

const normalizeSectionPost = (item: WPItem, sectionLabel: string, basePath: string): ContentItem => ({
  id: item.id,
  slug: item.slug,
  title: item.title?.rendered ?? 'Tanpa judul',
  excerpt: item.excerpt?.rendered ?? '',
  content: item.content?.rendered ?? '',
  date: item.date,
  featuredImageUrl: extractFeaturedImage(item),
  link: item.link,
  type: 'section',
  sectionLabel,
  detailPath: `${basePath}/${item.slug}`
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
  sectionLabel: 'Agenda',
  detailPath: `/agenda/${item.slug}`,
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

export const getSectionPosts = async (
  section: keyof typeof sectionCategoryMap,
  sectionLabel: string,
  basePath: string,
  page = 1,
  perPage = DEFAULT_PER_PAGE
): Promise<PaginatedResult<ContentItem>> => {
  const categorySlug = sectionCategoryMap[section];
  const categoryId = await resolveCategoryId(categorySlug);

  const { data, totalPages } = await fetchJson<WPItem[]>('/wp-json/wp/v2/posts', {
    page,
    per_page: perPage,
    _embed: 1,
    ...(categoryId ? { categories: categoryId } : {})
  });

  return {
    items: data.map((item) => normalizeSectionPost(item, sectionLabel, basePath)),
    totalPages: totalPages ?? 1
  };
};

export const getPageBySlug = async (slug: string): Promise<PageItem | null> => {
  const { data } = await fetchJson<WPItem[]>('/wp-json/wp/v2/pages', {
    slug,
    per_page: 1,
    _embed: 1
  });

  if (!data?.length) return null;

  return {
    id: data[0].id,
    slug: data[0].slug,
    title: data[0].title?.rendered ?? 'Tanpa judul',
    content: data[0].content?.rendered ?? ''
  };
};

export const getBySlug = async (
  type: 'posts' | 'agenda',
  slug: string,
  sectionLabel?: string,
  basePath?: string
): Promise<ContentItem | AgendaItem | null> => {
  const { data } = await fetchJson<WPItem[]>(`/wp-json/wp/v2/${type}`, {
    slug,
    per_page: 1,
    _embed: 1
  });
  if (!data || data.length === 0) return null;
  if (type === 'agenda') return normalizeAgenda(data[0]);
  if (sectionLabel && basePath) return normalizeSectionPost(data[0], sectionLabel, basePath);
  return normalizeArticle(data[0]);
};
