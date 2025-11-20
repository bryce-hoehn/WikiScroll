import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Page title */}
        <title>Wikiscroll</title>

        {/* Link the PWA manifest file. */}
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to Wikipedia/Wikimedia for faster API and image requests */}
        <link rel="preconnect" href="https://en.wikipedia.org" />
        <link rel="preconnect" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://en.wikipedia.org" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />

        {/* Theme color for mobile browsers - matches manifest */}
        <meta name="theme-color" content="#000000" />

        {/* Apple specific meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wikiscroll" />
        <link rel="apple-touch-icon" href="/icon.png" />


        <ScrollViewStyleReset />

        {/* Smooth scrolling for better UX on web */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html {
              scroll-behavior: smooth;
            }
            body {
              margin: 0;
              padding: 0;
            }
            #root {
              min-height: 100vh;
            }
            * {
              scroll-behavior: smooth;
            }
            * {
              scrollbar-width: thin;
              scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
            }
            div {
              scrollbar-width: thin;
              scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
            }
            /* Dark mode scrollbar support */
            @media (prefers-color-scheme: dark) {
              * {
                scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
              }
              div {
                scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
              }
            }
          `,
          }}
        />
        {/* Set initial background immediately based on user's theme preference */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              // Determine background color based on theme preference
              function getInitialBackgroundColor() {
                try {
                  // Check localStorage for saved theme preference
                  const savedTheme = localStorage.getItem('wikipediaexpo_theme_preference');
                  
                  // Theme color mappings
                  const themeColors = {
                    'light': '#F9F9FF',
                    'light-medium-contrast': '#F9F9FF',
                    'light-high-contrast': '#F9F9FF',
                    'dark': '#111318',
                    'dark-medium-contrast': '#111318',
                    'dark-high-contrast': '#111318',
                    'papyrus': '#F5E6D3'
                  };
                  
                  if (savedTheme && themeColors[savedTheme]) {
                    return themeColors[savedTheme];
                  }
                  
                  // If automatic or no preference, check system preference
                  if (!savedTheme || savedTheme === 'automatic') {
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      return '#111318'; // Dark theme
                    }
                    return '#F9F9FF'; // Light theme (default)
                  }
                  
                  // Fallback to dark theme
                  return '#111318';
                } catch (e) {
                  // If localStorage is not available, check system preference
                  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return '#111318';
                  }
                  return '#F9F9FF';
                }
              }
              
              const bgColor = getInitialBackgroundColor();
              
              // Set background color immediately
              if (document.documentElement) {
                document.documentElement.style.backgroundColor = bgColor;
              }
              if (document.body) {
                document.body.style.backgroundColor = bgColor;
              }
              const root = document.getElementById('root');
              if (root) {
                root.style.backgroundColor = bgColor;
                root.setAttribute('style', (root.getAttribute('style') || '') + '; background-color: ' + bgColor + ' !important;');
              }
              
              // Create a global style tag immediately to override everything
              let style = document.getElementById('initial-background-style');
              if (!style) {
                style = document.createElement('style');
                style.id = 'initial-background-style';
                style.textContent = 'html, body, #root { background-color: ' + bgColor + ' !important; }';
                document.head.insertBefore(style, document.head.firstChild);
              }
            })();
          `,
          }}
        />

      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
