# WikiFlow

A modern, cross-platform Wikipedia reader built with React Native and Expo. Explore Wikipedia with a beautiful, intuitive interface optimized for mobile devices. Experience the smooth flow of knowledge discovery.

## Features

### 🏠 Home Screen
- **For You Feed**: Personalized article recommendations based on your reading history
- **Hot Articles**: Trending content from Wikipedia's featured feed
- **Random Articles**: Discover new topics with random article exploration

### 🔍 Search & Discovery
- **Smart Search**: Real-time search suggestions with Wikipedia's API
- **Featured Content**: Today's featured article, picture of the day, and more
- **Trending Articles**: Most-read articles with daily updates
- **Categories**: Browse Wikipedia by topic categories

### 📚 Reading Experience
- **Bookmarks**: Save articles for offline reading
- **Dark Mode**: Comfortable reading in any lighting
- **Responsive Design**: Optimized for mobile and tablet screens
- **Article Navigation**: Easy navigation between related articles

### 🎨 Modern UI
- **Material Design**: Clean, modern interface using React Native Paper
- **Smooth Animations**: Fluid transitions and interactions
- **Accessibility**: Full accessibility support
- **Offline Support**: Read bookmarked articles without internet

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **UI Library**: React Native Paper
- **State Management**: React Context + TanStack Query
- **TypeScript**: Full type safety
- **Storage**: AsyncStorage for offline data

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WikipediaExpo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - Press `a` for Android
   - Press `i` for iOS  
   - Press `w` for web
   - Scan QR code with Expo Go app

### Development Scripts

- `npm start` - Start development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset to blank project

## Project Structure

```
WikipediaExpo/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Bottom tab navigation
│   └── (zArticleStack)/   # Article detail screens
├── components/            # Reusable UI components
├── hooks/                # Custom React hooks
├── api/                  # Wikipedia API integrations
├── types/                # TypeScript type definitions
├── context/              # React Context providers
├── utils/                # Utility functions
└── assets/               # Images and icons
```

## API Integration

The app integrates with multiple Wikipedia APIs:
- **Featured Content API**: Today's featured article, picture of the day
- **Pageviews API**: Trending articles and most-read content
- **Search API**: Real-time search suggestions
- **Article API**: Article summaries and metadata
- **Categories API**: Category browsing and navigation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Wikipedia for providing the content and APIs
- Expo team for the excellent development platform
- React Native community for the ecosystem
- React Native Paper for the UI components

---

**WikiFlow** - Where knowledge flows smoothly.
