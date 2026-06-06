import citiesData from '../src/data/cities.json';

export interface RouteConfig {
  path: string;
  priority: number;
}

export function getAllRoutes(): RouteConfig[] {
  const routes: RouteConfig[] = [];

  // Page d'accueil
  routes.push({ path: '/', priority: 1.0 });

  // Pages principales
  routes.push({ path: '/reservation-taxi-vsl/', priority: 0.9 });
  routes.push({ path: '/taxis-aeroports-parisiens/', priority: 0.8 });
  routes.push({ path: '/taxis-gares-parisiennes/', priority: 0.8 });
  routes.push({ path: '/zones-desservies/', priority: 0.8 });
  routes.push({ path: '/qui-sommes-nous/', priority: 0.7 });
  routes.push({ path: '/blog/', priority: 0.8 });
  routes.push({ path: '/contact/', priority: 0.7 });
  routes.push({ path: '/faq/', priority: 0.7 });
  routes.push({ path: '/mentions-legales/', priority: 0.5 });
  routes.push({ path: '/conditions-generales-de-vente/', priority: 0.5 });
  routes.push({ path: '/conditions-generales/', priority: 0.5 });

  // Pages départements
  const departments = [
    { code: '75', name: 'Paris' },
    { code: '91', name: 'Essonne' },
    { code: '92', name: 'Hauts-de-Seine' },
    { code: '93', name: 'Seine-Saint-Denis' },
    { code: '94', name: 'Val-de-Marne' }
  ];

  departments.forEach(dept => {
    const deptPath = `/taxi-conventionne-${dept.name.toLowerCase().replace(/\s+/g, '-')}-${dept.code}/`;
    routes.push({ path: deptPath, priority: 0.9 });
  });

  // Pages villes (81 villes)
  const data = citiesData as { departments: Array<{
    code: string;
    name: string;
    slug: string;
    cities: Array<{
      name: string;
      slug: string;
      postalCode: string;
    }>;
  }>};

  data.departments.forEach(dept => {
    dept.cities.forEach(city => {
      const cityPath = `/${dept.slug}/${city.slug}/`;
      routes.push({ path: cityPath, priority: 0.8 });
    });
  });

  return routes;
}

export function getRoutesForSitemap(): string {
  const routes = getAllRoutes();
  const baseUrl = 'https://www.taxisparis-conventionnes.fr';
  const today = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach(route => {
    const loc = route.path === '/' ? `${baseUrl}/` : `${baseUrl}${route.path}`;
    xml += '  <url>\n';
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${route.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}
