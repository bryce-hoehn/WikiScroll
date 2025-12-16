import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

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
        <link rel="apple-touch-icon" href="/icon.png" />


        <ScrollViewStyleReset />

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              function getInitialBackgroundColor() {
                try {
                  const savedTheme = localStorage.getItem('wikipediaexpo_theme_preference');
                  
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
                  
                  if (!savedTheme || savedTheme === 'automatic') {
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      return '#111318';
                    }
                    return '#F9F9FF';
                  }
                  
                  return '#111318';
                } catch (e) {
                  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return '#111318';
                  }
                  return '#F9F9FF';
                }
              }
              
              const bgColor = getInitialBackgroundColor();
              const surfaceColor = bgColor;
              
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
              
              let style = document.getElementById('initial-background-style');
              if (!style) {
                style = document.createElement('style');
                style.id = 'initial-background-style';
                style.textContent = 'html, body, #root { background-color: ' + bgColor + ' !important; }';
                document.head.insertBefore(style, document.head.firstChild);
              }
              
              function applyNavigationBarColor() {
                try {
                  const allElements = document.querySelectorAll('*');
                  allElements.forEach(el => {
                    if (el.getAttribute('data-theme-applied') === 'true') return;
                    
                    const computedStyle = window.getComputedStyle(el);
                    if (computedStyle.position === 'fixed' && 
                        (computedStyle.bottom === '0px' || computedStyle.bottom === '0') &&
                        (computedStyle.left === '0px' || computedStyle.left === '0') &&
                        (computedStyle.width === '100%' || computedStyle.right === '0px' || computedStyle.right === '0')) {
                      el.style.backgroundColor = surfaceColor;
                      el.setAttribute('data-theme-applied', 'true');
                      
                      const children = el.querySelectorAll('*');
                      children.forEach(child => {
                        const childStyle = window.getComputedStyle(child);
                        if (childStyle.backgroundColor === 'rgba(0, 0, 0, 0)' || 
                            childStyle.backgroundColor === 'transparent') {
                        }
                      });
                    }
                  });
                } catch (e) {
                }
              }
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', applyNavigationBarColor);
              } else {
                applyNavigationBarColor();
              }
              
              setTimeout(applyNavigationBarColor, 0);
              setTimeout(applyNavigationBarColor, 50);
              setTimeout(applyNavigationBarColor, 100);
              
              const observer = new MutationObserver(function(mutations) {
                applyNavigationBarColor();
              });
              
              if (document.body) {
                observer.observe(document.body, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['style', 'class']
                });
              } else {
                document.addEventListener('DOMContentLoaded', function() {
                  if (document.body) {
                    observer.observe(document.body, {
                      childList: true,
                      subtree: true,
                      attributes: true,
                      attributeFilter: ['style', 'class']
                    });
                  }
                });
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
