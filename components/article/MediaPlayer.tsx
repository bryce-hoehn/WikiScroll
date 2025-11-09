import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { WtfArticleImage } from '../../types/third-party/wtf-article';
import ResponsiveImage from '../common/ResponsiveImage';

interface MediaPlayerProps { 
  media: WtfArticleImage; 
  onImagePress: (imageUri: string, alt?: string) => void; 
}

export default function MediaPlayer({ media, onImagePress }: MediaPlayerProps) { 
  // For now, just display images for all media types
  // Audio and video files will show as static images with captions
  
  if (!media?.file || !media?.url) 
    return ( 
      <TouchableOpacity onPress={() => onImagePress(media.thumb || '')}> 
        <ResponsiveImage
          source={{ source: media.thumb || '', width: 400, height: 300 }} alt={media.caption || ''}
        />
        <Text variant="labelSmall">{media.caption}</Text>
      </TouchableOpacity> 
    ) 

  // Display image for all media types (audio, video, images)
  return ( 
    <TouchableOpacity onPress={() => onImagePress(media.url || media.thumb || '')}> 
      <ResponsiveImage
        source={{ source: media.thumb || media.url || '', width: 400, height: 300 }} alt={media.caption || ''}
      />
      <Text variant="labelSmall">{media.caption}</Text>
    </TouchableOpacity> 
  ); 
}
