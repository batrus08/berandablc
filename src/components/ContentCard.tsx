import { Link } from 'react-router-dom';
import { AgendaItem, ContentItem } from '../types/content';
import { sanitizeSnippet } from '../utils/sanitizeHtml';

interface ContentCardProps {
  item: ContentItem | AgendaItem;
}

const fallbackImage = '/placeholder.svg';

const formatAgendaDate = (startDate?: string) => {
  if (!startDate) return '';
  const dateObj = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString('id-ID');
};

const ContentCard = ({ item }: ContentCardProps) => {
  const href = item.type === 'article' ? `/artikel/${item.slug}` : `/agenda/${item.slug}`;
  const isAgenda = item.type === 'agenda';
  const agendaDate = isAgenda ? formatAgendaDate((item as AgendaItem).startDate) : '';
  const agendaLocation = isAgenda ? (item as AgendaItem).location : '';

  return (
    <article className="card">
      <img src={item.featuredImageUrl || fallbackImage} alt={item.title} loading="lazy" />
      <div className="content">
        <div className="meta">
          <span>{isAgenda ? agendaDate || 'Tanggal belum ditentukan' : new Date(item.date).toLocaleDateString('id-ID')}</span>
          <span>•</span>
          <span>{item.type === 'article' ? 'Artikel' : 'Agenda'}</span>
          {isAgenda && agendaLocation && (
            <>
              <span>•</span>
              <span>{agendaLocation}</span>
            </>
          )}
        </div>
        <h3>{item.title}</h3>
        <div
          className="snippet"
          dangerouslySetInnerHTML={{ __html: sanitizeSnippet(item.excerpt) }}
        />
        <Link to={href} style={{ fontWeight: 600 }}>
          Baca selengkapnya →
        </Link>
      </div>
    </article>
  );
};

export default ContentCard;
