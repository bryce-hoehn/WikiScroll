import { Image, ImageContentFit } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ImageStyle } from 'react-native';

interface ResponsiveImageProps {
  source: {
    source: string,
    height: number,
    width: number
  }
  contentFit?: ImageContentFit;
  style?: ImageStyle;
  alt?: string;
}

export default function ResponsiveImage({ 
  source, 
  contentFit = 'cover', 
  style = {},
  alt = ''
}: ResponsiveImageProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (source?.source && typeof source.source === 'string') {
      const width = source.width;
      const height = source.height;
      setDimensions({ width, height });
    }
  }, [source]);

  // Validate that source.source is a string before rendering
  const imageUri = source?.source && typeof source.source === 'string' ? source.source : null;

  return (
    <>
      {(dimensions.width > 0 && dimensions.height > 0 && imageUri) && (
        <Image 
          source={{ uri: imageUri }}
          contentFit={contentFit}
          alt={alt}
          style={[
            {
              width: '100%',
              aspectRatio: dimensions.width / dimensions.height
            },
            style
          ]}
        />
      )}
    </>
  );
}
