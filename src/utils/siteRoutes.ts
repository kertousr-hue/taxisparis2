export interface SiteRoute {
  path: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export const SITE_ROUTES: SiteRoute[] = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/reservation-taxi-vsl/', priority: 0.9, changefreq: 'weekly' },
  { path: '/taxi-conventionne-paris-75/', priority: 0.9, changefreq: 'weekly' },
  { path: '/taxi-conventionne-essonne-91/', priority: 0.9, changefreq: 'weekly' },
  { path: '/taxi-conventionne-hauts-de-seine-92/', priority: 0.9, changefreq: 'weekly' },
  { path: '/taxi-conventionne-seine-saint-denis-93/', priority: 0.9, changefreq: 'weekly' },
  { path: '/taxi-conventionne-val-de-marne-94/', priority: 0.9, changefreq: 'weekly' },
  { path: '/taxis-aeroports-parisiens/', priority: 0.8, changefreq: 'weekly' },
  { path: '/taxis-gares-parisiennes/', priority: 0.8, changefreq: 'weekly' },
  { path: '/zones-desservies/', priority: 0.8, changefreq: 'weekly' },
  { path: '/qui-sommes-nous/', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/', priority: 0.8, changefreq: 'weekly' },
  { path: '/faq/', priority: 0.7, changefreq: 'monthly' },
  { path: '/contact/', priority: 0.7, changefreq: 'yearly' },
];
