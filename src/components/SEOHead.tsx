import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string | string[];
  author?: string;
  robots?: string;
  canonical?: string;
  jsonLD?: any | any[];
}

function cleanSeoText(input: string): string {
  return input
    .replace(/\b(médicalisé|medicalise|médicalisée|medicalisee|médicalisés|medicalises|médicalisées|medicalisees)\b/gi, '')
    .replace(/\b(navette|navettes)\b/gi, '')
    .replace(/\b(liaison|liaisons)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([:;,.\-!?\)])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();
}

const CANONICAL_DOMAIN = 'https://www.taxisparis-conventionnes.fr';

export default function SEOHead({
  title,
  description,
  keywords,
  author = 'Taxi Conventionné',
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  canonical,
  jsonLD
}: SEOHeadProps) {
  const location = useLocation();

  // Normalize path: ensure exactly one trailing slash, except for root which stays "/"
  const rawPath = location.pathname.replace(/\/+$/, '') || '';
  const normalizedPath = rawPath === '' ? '/' : `${rawPath}/`;
  const canonicalUrl = canonical
    ? (canonical.endsWith('/') ? canonical : `${canonical}/`)
    : `${CANONICAL_DOMAIN}${normalizedPath}`;

  const safeTitle = cleanSeoText(title);
  const safeDescription = cleanSeoText(description);

  const keywordsString = keywords
    ? Array.isArray(keywords)
      ? keywords.join(', ')
      : keywords
    : '';

  const safeKeywords = keywordsString ? cleanSeoText(keywordsString) : '';

  const jsonLDArray = jsonLD
    ? Array.isArray(jsonLD)
      ? jsonLD.filter(Boolean)
      : [jsonLD].filter(Boolean)
    : [];

  return (
    <Helmet>
      <title>{safeTitle}</title>

      <meta name="description" content={safeDescription} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      {safeKeywords && <meta name="keywords" content={safeKeywords} />}

      {/* Canonical – single, authoritative URL for this page */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph – og:url must match canonical */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="Taxis Paris Conventionnés" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />

      {jsonLDArray.map((schema, index) => (
        <script key={`jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
