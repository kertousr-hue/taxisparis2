import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';
import { getAllRoutes } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist-ssg');
const DIST_CLIENT = path.join(__dirname, '..', 'dist');
const DIST_SSR = path.join(__dirname, '..', 'dist-ssr');

async function buildSSR() {
  console.log('\n⚙️  Build SSR en cours...');
  await build({
    build: {
      ssr: 'scripts/server-entry.tsx',
      outDir: DIST_SSR,
      rollupOptions: {
        output: {
          format: 'esm',
          entryFileNames: '[name].js',
        }
      },
      sourcemap: false,
      minify: false,
    },
    ssr: {
      noExternal: ['react-helmet-async'],
    },
  });
  console.log('✅ Build SSR terminé');
}

async function prerenderAll() {
  console.log('\n🚀 Démarrage du SSG avec ReactDOMServer...\n');

  if (!fs.existsSync(DIST_CLIENT)) {
    throw new Error('Le dossier dist client n\'existe pas. Lancez d\'abord `npm run build`');
  }

  await buildSSR();

  const serverEntryPath = path.join(DIST_SSR, 'server-entry.js');
  if (!fs.existsSync(serverEntryPath)) {
    throw new Error(`Fichier SSR introuvable: ${serverEntryPath}`);
  }

  const { render } = await import(serverEntryPath);

  const template = fs.readFileSync(path.join(DIST_CLIENT, 'index.html'), 'utf-8');

  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  console.log('📦 Copie des assets client...');
  copyDirectory(DIST_CLIENT, DIST_DIR);

  const ssgHtaccess = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Force HTTPS + WWW in a single combined redirect (avoids double 301 chain)
  RewriteCond %{HTTPS} off [OR]
  RewriteCond %{HTTP_HOST} !^www\\. [NC]
  RewriteCond %{HTTP_HOST} !^localhost [NC]
  RewriteRule ^(.*)$ https://www.taxisparis-conventionnes.fr/$1 [L,R=301]

  # Serve existing files directly (assets, images, sitemap, robots, etc.)
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteRule ^ - [L]

  # Remove trailing slash (redirect /foo/ -> /foo) except root
  RewriteCond %{REQUEST_URI} ^/(.+)/$
  RewriteRule ^(.+)/$ /$1 [R=301,L]

  # Force trailing slash on all non-file URLs (301 redirect)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_URI} !/$
  RewriteCond %{REQUEST_URI} !\\.[a-zA-Z0-9]{1,6}$
  RewriteRule ^(.*)$ /$1/ [R=301,L]

  # SSG: serve pre-rendered index.html for trailing-slash URLs
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}index.html -f
  RewriteRule ^(.+/)$ $1index.html [L]

  # Root index
  RewriteCond %{DOCUMENT_ROOT}/index.html -f
  RewriteRule ^$ /index.html [L]

  # Everything else: true 404 (not index.html fallback)
  RewriteRule ^ - [R=404,L]
</IfModule>

# Custom 404 page (returns real HTTP 404 status, NOT 200)
ErrorDocument 404 /404.html

# Security headers
<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "geolocation=(self), microphone=(), camera=()"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType application/json "access plus 0 seconds"
  ExpiresDefault "access plus 1 month"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
  </FilesMatch>
  <FilesMatch "\\.(css|js|jpg|jpeg|png|gif|webp|svg|woff|woff2|ttf|otf|eot|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json application/xml image/svg+xml
</IfModule>

Options -Indexes
Options +FollowSymLinks
ServerSignature Off
AddDefaultCharset UTF-8

<IfModule mod_mime.c>
  AddType text/html .html
  AddType text/css .css
  AddType application/javascript .js
  AddType application/json .json
  AddType image/svg+xml .svg
  AddType image/webp .webp
  AddType font/woff .woff
  AddType font/woff2 .woff2
</IfModule>

<FilesMatch "^\\.">
  Order allow,deny
  Deny from all
</FilesMatch>

FileETag None
`;
  fs.writeFileSync(path.join(DIST_DIR, '.htaccess'), ssgHtaccess, 'utf-8');
  console.log('✅ Assets copiés + .htaccess SSG écrit\n');

  const routes = getAllRoutes();
  console.log(`📄 Prérendu de ${routes.length} routes avec SSR...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    try {
      const { html: appHtml, helmet } = render(route.path);

      const fullHtml = injectIntoTemplate(template, appHtml, helmet, route.path);

      const cleanRoutePath = route.path.replace(/\/+$/, '');
      const outputPath = cleanRoutePath === ''
        ? path.join(DIST_DIR, 'index.html')
        : path.join(DIST_DIR, cleanRoutePath, 'index.html');

      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, fullHtml, 'utf-8');
      successCount++;

      if ((i + 1) % 10 === 0 || (i + 1) === routes.length) {
        console.log(`  ✓ ${i + 1}/${routes.length} routes générées...`);
      }
    } catch (error) {
      console.error(`  ✗ Erreur pour ${route.path}:`, error instanceof Error ? error.message : error);
      errorCount++;
    }
  }

  const notFoundHtml = render404(template);
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), notFoundHtml, 'utf-8');
  console.log('\n  ✓ 404.html généré');

  console.log(`\n✅ Prérendu SSR terminé :`);
  console.log(`  • ${successCount} routes générées avec succès`);
  if (errorCount > 0) {
    console.log(`  • ${errorCount} erreurs`);
  }

  fs.rmSync(DIST_SSR, { recursive: true, force: true });
  console.log('🧹 Dossier SSR temporaire nettoyé');
}

function injectIntoTemplate(template: string, appHtml: string, helmet: any, routePath: string): string {
  const domain = 'https://www.taxisparis-conventionnes.fr';
  const withSlash = routePath === '/' ? '/' : (routePath.endsWith('/') ? routePath : `${routePath}/`);
  const canonicalUrl = `${domain}${withSlash}`;

  const titleTag = helmet?.title?.toString() || '<title>Taxi VSL Conventionné | Paris Île-de-France</title>';
  const metaTags = helmet?.meta?.toString() || '';
  const linkTags = helmet?.link?.toString() || '';
  const scriptTags = helmet?.script?.toString() || '';

  const hasCanonical = linkTags.includes('rel="canonical"');
  const canonicalTag = hasCanonical ? '' : `<link rel="canonical" href="${canonicalUrl}" />`;

  let html = template;

  html = html.replace(
    '</head>',
    `  ${titleTag}\n  ${metaTags}\n  ${linkTags}\n  ${canonicalTag}\n  ${scriptTags}\n  </head>`
  );

  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  return html;
}

function render404(template: string): string {
  const notFoundHtml = `
    <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f9fafb;font-family:sans-serif;text-align:center;padding:2rem">
      <p style="font-size:5rem;font-weight:700;color:#e5e7eb;margin:0">404</p>
      <h1 style="font-size:1.5rem;font-weight:600;color:#1f2937;margin:.5rem 0">Page introuvable</h1>
      <p style="color:#6b7280;margin:.75rem 0">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <a href="/" style="margin-top:2rem;display:inline-block;background:#eab308;color:#fff;font-weight:600;padding:.75rem 1.5rem;border-radius:.5rem;text-decoration:none">Retour à l'accueil</a>
    </div>
  `;

  let html = template;

  html = html.replace(
    '</head>',
    `  <title>Page introuvable – 404 | Taxis Paris Conventionnés</title>\n  <meta name="robots" content="noindex, nofollow" />\n  </head>`
  );

  html = html.replace('<div id="root"></div>', `<div id="root">${notFoundHtml}</div>`);

  return html;
}

function copyDirectory(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    try {
      if (entry.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.writeFileSync(destPath, fs.readFileSync(srcPath));
      }
    } catch (error) {
      console.error(`Warning: Failed to copy ${entry.name}:`, error instanceof Error ? error.message : error);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  prerenderAll()
    .then(() => {
      console.log('\n🎉 SSG terminé avec succès !');
      console.log(`📁 Fichiers générés dans: ${DIST_DIR}\n`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erreur lors du SSG:', error);
      process.exit(1);
    });
}
