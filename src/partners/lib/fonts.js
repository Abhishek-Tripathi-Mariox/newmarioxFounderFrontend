// The partner design system's web fonts (Bricolage Grotesque, Geist, Geist Mono): one <link> in <head>,
// added the first time a partner screen mounts (the partner app, or a partner page hosted in Founders HQ).
const FONTS_ID = 'pp-fonts';
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap';

export function ensurePartnerFonts() {
  if (typeof document === 'undefined' || document.getElementById(FONTS_ID)) return;
  document.head.appendChild(Object.assign(document.createElement('link'), { id: FONTS_ID, rel: 'stylesheet', href: FONTS_HREF }));
}
