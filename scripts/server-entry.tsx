import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../src/App';

export function render(url: string) {
  const helmetContext = {};

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  );

  // @ts-ignore
  const { helmet } = helmetContext;

  return {
    html,
    helmet: helmet || {
      htmlAttributes: { toString: () => '' },
      bodyAttributes: { toString: () => '' },
      title: { toString: () => '<title>Taxi VSL Conventionné</title>' },
      meta: { toString: () => '' },
      link: { toString: () => '' },
      script: { toString: () => '' },
    },
  };
}
