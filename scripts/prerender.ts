import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllRoutes } from './routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PrerenderOptions {
  distDir: string;
  templatePath: string;
}

export async function prerender(options: PrerenderOptions) {
  const { distDir, templatePath } = options;
  const routes = getAllRoutes();

  console.log(`\n🎨 Prérendu de ${routes.length} routes...`);

  // Lire le template HTML de base
  const template = fs.readFileSync(templatePath, 'utf-8');

  let successCount = 0;
  let errorCount = 0;

  for (const route of routes) {
    try {
      // Créer le chemin de sortie
      const routePath = route.path === '/' ? '/index.html' : `${route.path}/index.html`;
      const outputPath = path.join(distDir, routePath);
      const outputDir = path.dirname(outputPath);

      // Créer le dossier si nécessaire
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Pour le SSG simple, on copie juste le template de base
      // Le contenu sera hydraté côté client
      // Mais on peut ajouter des métadonnées spécifiques par route

      let html = template;

      // Personnaliser les métadonnées selon la route
      html = customizeMetaTags(html, route.path);

      // Écrire le fichier
      fs.writeFileSync(outputPath, html, 'utf-8');
      successCount++;

      if (successCount % 10 === 0) {
        console.log(`  ✓ ${successCount}/${routes.length} routes générées...`);
      }
    } catch (error) {
      console.error(`  ✗ Erreur pour ${route.path}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✅ Prérendu terminé :`);
  console.log(`  • ${successCount} routes générées avec succès`);
  if (errorCount > 0) {
    console.log(`  • ${errorCount} erreurs`);
  }
}

function customizeMetaTags(html: string, routePath: string): string {
  // Cette fonction peut être améliorée pour injecter des métas spécifiques
  // Pour l'instant, on garde le template de base
  // Les métas seront gérées par react-helmet-async au chargement
  return html;
}

// Script principal
if (import.meta.url === `file://${process.argv[1]}`) {
  const distDir = path.join(__dirname, '..', 'dist');
  const templatePath = path.join(distDir, 'index.html');

  if (!fs.existsSync(distDir)) {
    console.error('❌ Le dossier dist n\'existe pas. Lancez d\'abord `npm run build`');
    process.exit(1);
  }

  if (!fs.existsSync(templatePath)) {
    console.error('❌ Le fichier template index.html n\'existe pas dans dist/');
    process.exit(1);
  }

  prerender({ distDir, templatePath })
    .then(() => {
      console.log('\n🎉 Prérendu terminé avec succès !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Erreur lors du prérendu:', error);
      process.exit(1);
    });
}
