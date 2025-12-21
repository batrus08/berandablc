export interface ContentItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImageUrl?: string;
  link?: string;
  type: 'article' | 'agenda';
}

export interface PaginatedResult<T> {
  items: T[];
  totalPages: number;
}
