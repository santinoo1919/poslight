# POS Light - Corner Shop POS System

A fast, offline-capable Point of Sale system built with React Native, Expo, and TinyBase.

## 🚀 Features

- **Fast Product Search** - Real-time filtering through inventory
- **Offline-First** - Works without internet connection
- **Stock Management** - Real-time inventory tracking
- **Cross-Platform** - Web, iOS, and Android ready
- **Modern UI** - Clean interface using NativeWind

## 🛠️ Tech Stack

- **Frontend**: React Native + Expo
- **Styling**: NativeWind (Tailwind CSS)
- **Database**: TinyBase (Local storage)
- **State Management**: Zustand + React Hooks
- **Offline Support**: TinyBase + AsyncStorage

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🏗️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
# Start Expo development server
npx expo start

# For web
npx expo start --web

# For iOS simulator
npx expo start --ios

# For Android emulator
npx expo start --android
```

## 🔧 Data Management

### Local Data Storage

The app uses TinyBase for local data storage with AsyncStorage persistence:

- **Products**: Stored locally with categories and inventory
- **Transactions**: Sales history and transaction items
- **Metrics**: Daily sales and cashflow tracking
- **Offline-First**: Works without internet connection

## 📱 App Structure

```
src/
├── components/
│   ├── common/          # Shared components
│   ├── platform/        # Platform-specific components
│   ├── ProductCard.tsx  # Product display component
│   ├── ProductGrid.tsx  # Product grid with search
│   └── SearchBar.tsx    # Search input component
├── hooks/
│   ├── useProductsQuery.ts # Products data management
│   └── useDataSync.ts   # Data synchronization
├── services/
│   └── tinybaseStore.ts # TinyBase data store
├── stores/
│   ├── productStore.ts  # Zustand product state
│   └── cartStore.ts     # Zustand cart state
└── utils/
    └── responsive.ts    # Responsive utilities
```

## 🔄 Data Flow

1. **App Loads** → Initializes TinyBase store
2. **Data Loading** → Loads products and inventory from local storage
3. **Real-time Updates** → TinyBase reactive updates
4. **Search** → Fast in-memory filtering
5. **Persistence** → Automatic save to AsyncStorage

## 🎯 Next Steps (v1)

- [x] Cart functionality
- [x] Transaction processing
- [x] Local storage with TinyBase
- [ ] Data backup and export
- [ ] Multi-currency support
- [ ] Receipt generation

## 🐛 Troubleshooting

### Search Not Working

- Check TinyBase store initialization
- Verify products are loaded in local storage
- Ensure search query is properly formatted

### Data Issues

- Check AsyncStorage permissions
- Verify TinyBase store persistence
- Monitor storage usage (6MB limit on iOS)

### Performance Issues

- Check product count in local storage
- Verify image sizes and optimization
- Monitor memory usage with large datasets

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Built with ❤️ for corner shops everywhere**
