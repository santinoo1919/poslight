# POS Light - Corner Shop POS System

A fast, offline-capable Point of Sale system built with React Native, Expo, and Medusa.

## 🚀 Features

- **Fast Product Search** - Real-time filtering through inventory
- **Offline-First** - Works without internet connection
- **Stock Management** - Real-time inventory tracking
- **Cross-Platform** - Web, iOS, and Android ready
- **Modern UI** - Clean interface using NativeWind

## 🛠️ Tech Stack

- **Frontend**: React Native + Expo
- **Styling**: NativeWind (Tailwind CSS)
- **Backend**: Medusa (E-commerce API)
- **State Management**: React Hooks
- **Offline Support**: Local fallback + sync

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Medusa backend running (see setup below)

## 🏗️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Medusa Backend

Update `config/medusa.js` with your Medusa instance URL:

```javascript
export const MEDUSA_CONFIG = {
  BASE_URL: "http://localhost:9000", // Your Medusa URL
  // ... other config
};
```

### 3. Start Development Server

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

## 🔧 Medusa Backend Setup

### Quick Start with Medusa

```bash
# Install Medusa CLI
npm install -g @medusajs/medusa-cli

# Create new Medusa project
medusa new my-medusa-store

# Navigate to project
cd my-medusa-store

# Install dependencies
npm install

# Start development server
medusa develop
```

### Add Test Products

1. **Via Admin Panel** (http://localhost:9000/app)
2. **Via API** - Use Medusa's product creation endpoints
3. **Via Seed Scripts** - Create custom seed data

### Required Product Structure

Products need:

- Title (name)
- Variants with prices
- Inventory items with stock quantities
- Collections (categories)

## 📱 App Structure

```
src/
├── components/
│   ├── common/          # Shared components
│   ├── platform/        # Platform-specific components
│   ├── ProductCard.js   # Product display component
│   ├── ProductGrid.js   # Product grid with search
│   └── SearchBar.js     # Search input component
├── hooks/
│   └── useProducts.js   # Products state management
├── services/
│   └── medusaApi.js     # Medusa API integration
├── config/
│   └── medusa.js        # Configuration
└── utils/
    └── responsive.js     # Responsive utilities
```

## 🔄 Data Flow

1. **App Loads** → Checks Medusa connection
2. **Online** → Fetches products from Medusa
3. **Offline** → Falls back to cached/mock data
4. **Search** → Real-time filtering (local or API)
5. **Sync** → Background synchronization when online

## 🎯 Next Steps (v1)

- [ ] Cart functionality
- [ ] Transaction processing
- [ ] SQLite local storage
- [ ] Offline queue system
- [ ] Stock updates
- [ ] Receipt generation

## 🐛 Troubleshooting

### Search Not Working

- Check Medusa connection in console
- Verify API endpoints in config
- Ensure products have proper structure

### Offline Mode

- App automatically falls back to mock data
- Check network connectivity
- Verify Medusa server is running

### Performance Issues

- Check product count (limit: 100)
- Verify image sizes
- Monitor network requests

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
