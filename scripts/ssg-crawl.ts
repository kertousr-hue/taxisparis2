import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer, { Browser, Page } from 'puppeteer';
import { spawn, ChildProcess } from 'child_process';
import { getAllRoutes } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist-ssg');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

async function startPreviewServer(): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'preview', '--', '--port', String(PORT)], {
      stdio: 'pipe',
      shell: true
    });

    let started = false;

    server.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      if (output.includes('Local:') || output.includes('localhost')) {
        if (!started) {
          started = true;
          setTimeout(() => resolve(server), 2000);
        }
      }
    });

    server.stderr?.on('data', (data) => {
      console.error(data.toString());
    });

    server.on('error', reject);

    setTimeout(() => {
      if (!started) {
        reject(new Error('Server failed to start in time'));
      }
    }, 15000);
  });
}

async function crawlPage(browser: Browser, route: string): Promise<string> {
  const page: Page = await browser.newPage();

  try {
    const url = `${BASE_URL}${route}`;

    // Aller à la page
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Attendre l'hydratation React et que Helmet mette à jour le head
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Attendre que le canonical soit présent (preuve que Helmet a fini)
    await page.waitForSelector('link[rel="canonical"]', { timeout: 5000 }).catch(() => {
      console.warn(`  ⚠️  Pas de canonical trouvé pour ${route}`);
    });

    // Récupérer le HTML complet
    const html = await page.content();

    return html;
  } finally {
    await page.close();
  }
}

async function prerenderAll() {
  console.log('\n🚀 Démarrage du SSG avec crawling...\n');

  // Nettoyer et créer le dossier de destination
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // Copier tous les fichiers du dist original
  const distOriginal = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distOriginal)) {
    throw new Error('Le dossier dist n\'existe pas. Lancez d\'abord `npm run build`');
  }

  console.log('📦 Copie des assets...');
  copyDirectory(distOriginal, DIST_DIR);

  // Démarrer le serveur de preview
  console.log('\n🌐 Démarrage du serveur preview...');
  let server: ChildProcess | null = null;
  let browser: Browser | null = null;

  try {
    server = await startPreviewServer();
    console.log('✅ Serveur démarré\n');

    // Démarrer Puppeteer
    console.log('🎭 Lancement de Puppeteer...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    console.log('✅ Puppeteer prêt\n');

    // Récupérer toutes les routes (on exclut le catch-all *)
    const routes = getAllRoutes();
    console.log(`📄 Prérendu de ${routes.length} routes...\n`);

    let successCount = 0;
    let errorCount = 0;

    // Crawler chaque route
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      try {
        const html = await crawlPage(browser, route.path);

        // Déterminer le chemin de sortie
        const outputPath = route.path === '/'
          ? path.join(DIST_DIR, 'index.html')
          : path.join(DIST_DIR, route.path, 'index.html');

        // Créer le dossier si nécessaire
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Écrire le fichier HTML
        fs.writeFileSync(outputPath, html, 'utf-8');
        successCount++;

        if ((i + 1) % 5 === 0 || (i + 1) === routes.length) {
          console.log(`  ✓ ${i + 1}/${routes.length} routes générées...`);
        }
      } catch (error) {
        console.error(`  ✗ Erreur pour ${route.path}:`, error instanceof Error ? error.message : error);
        errorCount++;
      }
    }

    // Générer la page 404 pré-rendue
    console.log('\n🔴 Génération de la page 404...');
    try {
      const html404 = await crawlPage(browser, '/cette-page-nexiste-pas-404');
      const output404Path = path.join(DIST_DIR, '404.html');
      fs.writeFileSync(output404Path, html404, 'utf-8');
      console.log('  ✓ 404.html généré');
    } catch (err) {
      console.warn('  ⚠️  Impossible de générer 404.html:', err instanceof Error ? err.message : err);
    }

    console.log(`\n✅ Prérendu terminé :`);
    console.log(`  • ${successCount} routes générées avec succès`);
    if (errorCount > 0) {
      console.log(`  • ${errorCount} erreurs`);
    }

  } finally {
    // Nettoyer
    if (browser) {
      await browser.close();
      console.log('\n🎭 Puppeteer arrêté');
    }
    if (server) {
      server.kill();
      console.log('🌐 Serveur preview arrêté');
    }
  }
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
        // Use read/write instead of copyFile for better reliability
        const content = fs.readFileSync(srcPath);
        fs.writeFileSync(destPath, content);
      }
    } catch (error) {
      console.error(`Warning: Failed to copy ${entry.name}:`, error instanceof Error ? error.message : error);
      // Continue with other files
    }
  }
}

// Exécution
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
