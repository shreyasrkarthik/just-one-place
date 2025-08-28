# VibePick - One Perfect Recommendation

Stop scrolling through endless options. VibePick gives you exactly one perfect recommendation based on your mood and location.

## ✨ Features

- 🗺️ **ZIP Code to Location**: Comprehensive US ZIP code coverage via OpenCage API
- 🎯 **Mood-Based Recommendations**: Get personalized place suggestions based on your current mood
- 📍 **Location Awareness**: Find places within 10km of your location
- 🏢 **Real Place Data**: Dynamic recommendations from Foursquare Places API
- 🎭 **Smart Filtering**: Places automatically filtered by mood category and proximity
- ⭐ **Rich Data**: Ratings, photos, hours, and contact information
- 🔄 **Fallback System**: Graceful degradation when APIs are unavailable

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Foursquare API key (free tier: 50,000 requests/month)
- OpenCage API key (free tier: 2,500 requests/day)

### Installation

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd vibepick

# Install dependencies
npm install

# Set up environment variables
# Create a .env file and add your API keys (see API_SETUP.md for details)

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in your project root:

```bash
# Primary API for place recommendations
VITE_FOURSQUARE_API_KEY=your_foursquare_api_key_here

# Required for ZIP code to location conversion
VITE_OPENCAGE_API_KEY=your_opencage_api_key_here

# Optional fallback APIs
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

**Get your API keys:**
- Foursquare: [foursquare.com/developers](https://foursquare.com/developers)
- OpenCage: [opencagedata.com](https://opencagedata.com/users/sign_up)

See [API_SETUP.md](API_SETUP.md) for detailed setup instructions.

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── components/       # React components
├── utils/           # Utilities and services
├── hooks/           # Custom React hooks
├── pages/           # Page components
└── lib/             # Library configurations
```

## 🏢 Place Recommendations API

This project uses the Foursquare Places API for dynamic recommendations:

- **Primary API**: Foursquare Places API with 100M+ venues worldwide
- **Mood Categories**: Specific category mapping for each mood type
- **Rich Data**: Ratings, photos, hours, contact info, and more
- **Smart Search**: Category-based and keyword-based searches
- **Fallback System**: Google Places API and mock data fallbacks

## 🗺️ Location Services

ZIP code to location conversion via OpenCage API:

- **Full Coverage**: All US ZIP codes (42,000+ codes)
- **Accurate Data**: Real coordinates and city/state information
- **Rate Limiting**: Respects API limits and best practices

## 🎯 How It Works

1. **User Input**: Enter ZIP code or share GPS location
2. **Location Conversion**: ZIP code converted to coordinates via OpenCage API
3. **Mood Selection**: Choose your current mood from available options
4. **API Search**: Foursquare searches by mood-specific categories and keywords
5. **Smart Filtering**: Places filtered by mood, rating, and distance
6. **Recommendation**: Get one perfect place recommendation with rich data

## 🎨 Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Places API**: Foursquare Places API (primary)
- **Location API**: OpenCage Geocoding API
- **Fallback APIs**: Google Places API, Yelp Fusion API
- **State Management**: React hooks
- **Deployment**: Vercel/Netlify ready

## 🚀 Deployment

### Build and Deploy

```bash
# Build the project
npm run build

# Deploy to your preferred platform
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod
# - GitHub Pages: npm run deploy
```

### Environment Variables

Make sure to set your production environment variables:

```bash
VITE_FOURSQUARE_API_KEY=your_production_foursquare_key
VITE_OPENCAGE_API_KEY=your_production_opencage_key
VITE_GOOGLE_PLACES_API_KEY=your_google_places_key  # optional
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **API Issues**: 
  - Foursquare: [Foursquare Developer Support](https://foursquare.com/developers/)
  - OpenCage: [OpenCage Status](https://status.opencagedata.com)
- **Project Issues**: Open an issue in this repository
- **Documentation**: Check [API_SETUP.md](API_SETUP.md) and inline code comments

---

**Ready to stop endless scrolling?** Get started with free Foursquare and OpenCage API keys and enjoy VibePick's perfect recommendations! 🎉
