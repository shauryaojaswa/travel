import { useEffect } from 'react';

/** Sets per-page SEO title + meta description (title, description, og tags). */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} | Delhi Calm Travel`;

    const setMeta = (selector: string, attr: 'name' | 'property', value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value === 'description' ? 'description' : selector.split('"')[1]);
        document.head.appendChild(el);
      }
      el.setAttribute('content', description);
    };

    setMeta('meta[name="description"]', 'name', 'description');
    setMeta('meta[property="og:title"]', 'property', 'og:title');
    setMeta('meta[property="og:description"]', 'property', 'og:description');
  }, [title, description]);
}
