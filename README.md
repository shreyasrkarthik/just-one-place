# VibePick - One Perfect Recommendation

Stop scrolling through endless options. VibePick gives you exactly one perfect recommendation based on your mood and location.

## ✨ Features

- 🗺️ **ZIP Code to Location**: Comprehensive US ZIP code coverage via OpenCage API
- 🎯 **Mood-Based Recommendations**: Get personalized place suggestions based on your current mood
- 📍 **Location Awareness**: Find places within 20 miles of your location
- 🎭 **Smart Filtering**: Places automatically filtered by mood and proximity
- 🔄 **Fallback System**: Graceful degradation when API is unavailable

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- OpenCage API key (free tier: 2,500 requests/day)

### Installation

```bash
# Clone the repository
git clone <YOUR_REPO_URL>
cd vibepick

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OpenCage API key

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in your project root:

```bash
VITE_OPENCAGE_API_KEY=your_actual_api_key_here
```

Get your free API key at [opencagedata.com](https://opencagedata.com/users/sign_up)

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

## 🗺️ ZIP Code API Integration

This project includes comprehensive ZIP code to location conversion:

- **Real API**: OpenCage Geocoding API integration
- **Full Coverage**: All US ZIP codes (42,000+ codes)
- **Accurate Data**: Real coordinates and city/state information
- **Smart Fallbacks**: Mock data when API unavailable
- **Rate Limiting**: Respects API limits and best practices

## 🎯 How It Works

1. **User Input**: Enter ZIP code or share GPS location
2. **Location Conversion**: ZIP code converted to coordinates via API
3. **Mood Selection**: Choose your current mood from available options
4. **Smart Filtering**: Places filtered by mood category and distance
5. **Recommendation**: Get one perfect place recommendation within 20 miles

## 🎨 Technologies Used

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Location API**: OpenCage Geocoding API
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
VITE_OPENCAGE_API_KEY=your_production_api_key
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

- **API Issues**: Check [OpenCage Status](https://status.opencagedata.com)
- **Project Issues**: Open an issue in this repository
- **Documentation**: Check the inline code comments and component documentation

---

**Ready to stop endless scrolling?** Get started with a free OpenCage API key and enjoy VibePick's perfect recommendations! 🎉
