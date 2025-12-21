import DOMPurify from 'dompurify';

const clean = (html: string) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

export const sanitizeSnippet = (html: string) => clean(html || '');
export const sanitizeContent = (html: string) => clean(html || '');
