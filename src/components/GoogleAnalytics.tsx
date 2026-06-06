import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = 'G-3780TKJD8H';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const id = measurementId || GA_ID;
  const location = useLocation();

  useEffect(() => {
    if (!id) return;
    if (window.gtag) return;

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script1);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: true });
  }, [id]);

  useEffect(() => {
    if (window.gtag && id) {
      window.gtag('config', id, { page_path: location.pathname + location.search });
    }
  }, [location, id]);

  return null;
}
