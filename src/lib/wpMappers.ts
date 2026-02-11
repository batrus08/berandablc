import { AgendaItem } from '../types/content';
import { WpAgendaItem } from './wpApi';

export const mapWpAgendaToAgendaItem = (item: WpAgendaItem): AgendaItem => ({
  id: item.id,
  slug: item.slug,
  title: item.title?.rendered ?? 'Tanpa judul',
  excerpt: item.excerpt?.rendered ?? '',
  content: item.content?.rendered ?? '',
  date: item.date,
  featuredImageUrl: item.poster_url || '/placeholder.svg',
  link: item.link,
  type: 'agenda',
  startDate: item.start_date ?? '',
  endDate: item.end_date ?? '',
  time: item.time ?? '',
  location: item.location ?? '',
  registerUrl: item.register_url ?? '',
  minutesUrl: item.minutes_url ?? '',
  reportUrl: item.report_url ?? ''
});
