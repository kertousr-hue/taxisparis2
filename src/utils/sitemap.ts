import { departmentsSEO } from './seodata';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Sécurisation des caractères spéciaux pour XML
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Génération du sitemap XML
export function generateSitemap(urls: SitemapUrl[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urlElements = urls
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .map(url => {
      let urlXml = '  <url>\n';
      urlXml += `    <loc>${escapeXml(url.loc)}</loc>\n`;

      if (url.lastmod) {
        urlXml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }

      if (url.changefreq) {
        urlXml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }

      if (url.priority !== undefined) {
        urlXml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
      }

      urlXml += '  </url>';
      return urlXml;
    })
    .join('\n');

  return `${xmlHeader}\n${urlsetOpen}\n${urlElements}\n${urlsetClose}`;
}

// Génération automatique de toutes les URLs du site
export function getSitemapUrls(baseUrl: string): SitemapUrl[] {
  const today = new Date().toISOString().split('T')[0];

  const base = baseUrl.replace(/\/$/, '');

  const urls: SitemapUrl[] = [
    {
      loc: `${base}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${base}/reservation-taxi-vsl/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${base}/taxis-aeroports-parisiens/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${base}/taxis-gares-parisiennes/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${base}/zones-desservies/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: `${base}/qui-sommes-nous/`,
      lastmod: today,
      changefreq: 'yearly',
      priority: 0.6
    },
    {
      loc: `${base}/blog/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${base}/faq/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      loc: `${base}/contact/`,
      lastmod: today,
      changefreq: 'yearly',
      priority: 0.6
    }
  ];

  // Ajout automatique des pages départements
  Object.values(departmentsSEO).forEach(dept => {
    const deptSlug = `taxi-conventionne-${dept.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ /g, '-')}-${dept.code}`;

    urls.push({
      loc: `${base}/${deptSlug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.9
    });

    // Ajout automatique des pages villes
    dept.cities.forEach(city => {
      const citySlug = city
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ /g, '-');

      urls.push({
        loc: `${base}/${deptSlug}/${citySlug}/`,
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.8
      });
    });
  });

  return urls;
}
