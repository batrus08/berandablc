import { Link } from 'react-router-dom';
import { ContentItem } from '../types/content';
import { sanitizeSnippet } from '../utils/sanitizeHtml';

interface ContentCardProps {
  item: ContentItem;
}

const fallbackImage = '/placeholder.svg';

const ContentCard = ({ item }: ContentCardProps) => {
  const href = item.type === 'article' ? `/artikel/${item.slug}` : `/agenda/${item.slug}`;

  return (
    <article className="card">
      <img src={item.featuredImageUrl || fallbackImage} alt={item.title} loading="lazy" />
      <div className="content">
        <div className="meta">
          <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
          <span>•</span>
          <span>{item.type === 'article' ? 'Artikel' : 'Agenda'}</span>
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
