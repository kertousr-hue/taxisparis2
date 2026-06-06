import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page introuvable – 404 | Taxis Paris Conventionnés';
  }, []);

  return (
    <>
      <Helmet>
        <title>Page introuvable – 404 | Taxis Paris Conventionnés</title>
        <meta name="description" content="La page que vous recherchez n'existe pas ou a été déplacée." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="max-w-md">
          <p className="text-8xl font-bold text-gray-200 select-none">404</p>
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">Page introuvable</h1>
          <p className="mt-3 text-gray-500 leading-relaxed">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </>
  );
}
