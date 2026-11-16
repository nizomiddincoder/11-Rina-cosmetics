/**
 * Google shriftlarini sahifani bloklamasdan yuklash: avval tizim shrifti bilan darhol chiziladi,
 * shrift kelgach almashadi.
 */
export const BASE_FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap';

const loading = new Map<string, Promise<void>>();

export function loadFontCss(href: string): Promise<void> {
  const existing = loading.get(href);
  if (existing) return existing;
  const p = new Promise<void>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve(); // shriftsiz ham ishlaydi
    document.head.appendChild(link);
  });
  loading.set(href, p);
  return p;
}
