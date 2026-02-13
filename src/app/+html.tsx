import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <title>WikiScape</title>

        <link rel="manifest" href="/manifest.json" />

        <link rel="preconnect" href="https://en.wikipedia.org" />
        <link rel="preconnect" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://en.wikipedia.org" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />

        <meta name="theme-color" content="#000000" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WikiScape" />

        <meta name="google-adsense-account" content="ca-pub-5306494001256992" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body style={{ height: '100vh', overflow: 'hidden' }}>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div
          id="root"
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
