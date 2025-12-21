import { ContentItem } from '../types/content';
import { sanitizeContent, sanitizeSnippet } from '../utils/sanitizeHtml';

const fallbackImage = '/placeholder.svg';

interface ContentDetailProps {
  item: ContentItem;
}

const ContentDetail = ({ item }: ContentDetailProps) => {
  return (
    <article className="detail">
      <div className="meta">
        <span>{item.type === 'article' ? 'Artikel' : 'Agenda'}</span>
        <span>•</span>
        <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
      </div>
      <h1>{item.title}</h1>
      <img src={item.featuredImageUrl || fallbackImage} alt={item.title} />
      <div className="body">
        <div
          className="excerpt"
          dangerouslySetInnerHTML={{ __html: sanitizeSnippet(item.excerpt) }}
        />
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: sanitizeContent(item.content) }}
        />
      </div>
    </article>
  );
};

export default ContentDetail;
