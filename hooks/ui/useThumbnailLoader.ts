import { useEffect, useState } from 'react';
import { fetchArticleThumbnail } from '../../api';
import { ImageThumbnail } from '../../types/api/base';

interface ThumbnailItem {
  thumbnail?: ImageThumbnail;
  pages?: { thumbnail?: ImageThumbnail }[];
  links?: { thumbnail?: ImageThumbnail }[];
  html?: string;
}

/**
 * Hook for loading thumbnails from various content types
 * Extracts complex thumbnail loading logic from FeaturedCarousel
 */
export default function useThumbnailLoader(item: ThumbnailItem | null) {
  const [thumbnail, setThumbnail] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadThumbnail = async () => {
      // Check direct thumbnail first
      if (item?.thumbnail?.source) {
        setThumbnail(item.thumbnail.source);
        return;
      }
      
      // On This Day items
      if (item?.pages) {
        for (const page of item.pages) {
          if (page?.thumbnail?.source) {
            setThumbnail(page.thumbnail.source);
            return;
          }
        }
      }
      // In The News items
      else if (item?.links) {
        for (const link of item.links) {
          if (link?.thumbnail?.source) {
            setThumbnail(link.thumbnail.source);
            return;
          }
        }
      }
      // Did You Know items
      else if (item?.html) {
        const title = item.html.match(/title="([^"]*)"/)?.[1] || null;
        if (title) {
          const thumb = await fetchArticleThumbnail(title);
          if (thumb) {
            setThumbnail(thumb.source);
            return;
          }
        }
      }
    };

    loadThumbnail();
  }, [item]);

  return thumbnail;
}