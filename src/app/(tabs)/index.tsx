import ForYouFeed from '@/features/home/components/ForYouFeed';
import PopularFeed from '@/features/home/components/PopularFeed';
import RandomFeed from '@/features/home/components/RandomFeed';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';

const renderScene = SceneMap({
  home: ForYouFeed,
  popular: PopularFeed,
  random: RandomFeed
});

const routes = [
  { key: 'home', title: 'Home' },
  { key: 'popular', title: 'Popular' },
  { key: 'random', title: 'Random' }
];

export default function Home() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      style={{ flex: 1 }}
    />
  );
}
