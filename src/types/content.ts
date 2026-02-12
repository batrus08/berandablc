export type ContentType = 'article' | 'agenda' | 'section';

export interface ContentItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImageUrl?: string;
  link?: string;
  type: ContentType;
  sectionLabel?: string;
  detailPath?: string;
}

export interface AgendaItem extends ContentItem {
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  registerUrl: string;
}

export interface PageItem {
  id: number;
  slug: string;
  title: string;
  content: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalPages: number;
}
