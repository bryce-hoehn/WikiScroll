/**
 * Helper utilities for dealing with Wikipedia image URLs and internal article links.
 */

/**
 * Normalises a Wikipedia image `src` attribute into a fully qualified URL that can be
 * loaded by `expo-image`. Handles protocol‑relative URLs, relative paths, thumbnail
 * URLs, and Wikimedia Commons file URLs.
 *
 * @param src Raw `src` attribute from an `<img>` tag.
 * @returns Fully qualified URL string.
 */
export function resolveImageUrl(src: string): string {
  let imageUrl = src;

  // Protocol‑relative URLs (e.g. //upload.wikimedia.org/…)
  if (imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  }

  // Relative Wikipedia page URLs (e.g. /wiki/File:Example.jpg)
  if (imageUrl.startsWith('/')) {
    imageUrl = 'https://en.wikipedia.org' + imageUrl;
  }

  // Relative paths with leading "./"
  if (imageUrl.startsWith('./')) {
    imageUrl = 'https://en.wikipedia.org/wiki' + imageUrl.slice(1);
  }

  // Convert Wikipedia file page URLs to direct image URLs
  if (imageUrl.includes('/wiki/File:') || imageUrl.includes('/wiki/Image:')) {
    const fileName = imageUrl.split('/wiki/File:')[1] || imageUrl.split('/wiki/Image:')[1];
    if (fileName) {
      const cleanFileName = fileName.split('#')[0].split('?')[0];
      // Direct link to the original file on Wikimedia Commons
      imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${cleanFileName}`;
    }
  }

  // Strip thumbnail path to obtain the original image
  if (imageUrl.includes('/thumb/')) {
    imageUrl = imageUrl.replace('/thumb/', '/');
    const parts = imageUrl.split('/');
    // Remove the last segment (thumbnail filename)
    imageUrl = parts.slice(0, -1).join('/');
  }

  // Dynamic map tiles or other special URLs are left untouched
  return imageUrl;
}

/**
 * Parses a Wikipedia link (`href`) and extracts the article title suitable for
 * navigation within the app. Returns `null` if the link is external.
 *
 * @param href The raw href attribute from an `<a>` tag.
 * @returns Normalised article title or `null`.
 */
export function parseWikiLink(href: string): string | null {
  if (href.startsWith('/wiki/') || href.includes('wikipedia.org/wiki/')) {
    let articleTitle = '';

    if (href.startsWith('/wiki/')) {
      articleTitle = href.replace('/wiki/', '');
    } else if (href.includes('wikipedia.org/wiki/')) {
      const parts = href.split('/wiki/');
      if (parts.length > 1) articleTitle = parts[1];
    }

    // Remove anchors and query strings
    articleTitle = articleTitle.split('#')[0].split('?')[0];
    return articleTitle || null;
  }

  return null;
}