# API Setup Guide for Real Place Recommendations

This guide will help you set up the Foursquare Places API to get dynamic, location-aware place recommendations instead of the static mock data.

## 🚀 Quick Start

1. **Create a `.env` file in your project root:**
   ```env
   # Foursquare Places API (Primary - Required)
   VITE_FOURSQUARE_API_KEY=your_foursquare_api_key_here
   
   # Google Places API (Optional fallback)
   VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   
   # Yelp Fusion API (Optional for food focus)
   VITE_YELP_API_KEY=your_yelp_api_key_here
   ```

2. **Get your Foursquare API key** (see setup instructions below)

3. **Restart your development server**

## 🔑 Primary API: Foursquare Places API

### Why Foursquare?
- **Generous free tier**: 50,000 requests/month free
- **Rich venue data**: Categories, photos, ratings, hours, tips
- **Global coverage**: 100+ million places worldwide
- **Mood-based categories**: Perfect for our recommendation engine
- **Real-time data**: Live hours, popular times, trending venues

### Setup Instructions
1. **Visit [Foursquare Developer Console](https://foursquare.com/developers/)**
2. **Create an account** or sign in
3. **Create a new app**:
   - Choose "Places API" as your product
   - Give your app a name (e.g., "VibePick Recommendations")
   - Add a description
4. **Get your Service Key** (not API key) from the app dashboard
   - ⚠️ **Important**: Foursquare has migrated to service keys with Bearer token authentication
   - The new API uses `places-api.foursquare.com` endpoints
5. **Add it to your `.env` file**:
   ```env
   VITE_FOURSQUARE_API_KEY=fsq3YOUR_ACTUAL_SERVICE_KEY_HERE
   ```

### Optional Fallback APIs

#### Google Places API (Fallback)
- **Best for**: Comprehensive place data when Foursquare fails
- **Cost**: $0.017 per request after free tier
- **Setup**: 
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing
  3. Enable Places API
  4. Create credentials (API key)
  5. Restrict the key to Places API only

#### Yelp Fusion API (Food Focused Fallback)
- **Best for**: Restaurants, cafes, bars, reviews
- **Cost**: 500 requests/day free, then $0.01 per request
- **Setup**:
  1. Go to [Yelp Developers](https://www.yelp.com/developers)
  2. Create an account
  3. Create a new app
  4. Get your API key

## 📱 How It Works

Once configured, the app will:

1. **Try Foursquare first** - Primary API with mood-based categories
2. **Search by categories** - Uses specific Foursquare category IDs for each mood
3. **Search by keywords** - Falls back to keyword searches for broader results
4. **Fall back to Google Places** - If Foursquare fails or for additional results
5. **Use mock data** - If all APIs fail (ensures app always works)

## 🎯 Mood-Based Categories

The app uses Foursquare's category system to map user moods to relevant places:

- **Restless** → Gyms, Parks, Trails, Sports Complexes, Recreation Centers
- **Sad** → Bakeries, Cafés, Bookstores, Libraries, Movie Theaters
- **Romantic** → Restaurants, Bars, Parks, Art Galleries, Spas
- **Anxious** → Parks, Museums, Bookstores, Cafés, Yoga Studios
- **Celebratory** → Bars, Restaurants, Nightclubs, Entertainment, Bowling
- **Bored** → Entertainment, Museums, Movie Theaters, Bowling, Arcades
- **Energetic** → Gyms, Sports Complexes, Dance Studios, Music Venues, Climbing
- **Adventurous** → Trails, Parks, Adventure Sports, Tourist Attractions, Campgrounds
- **Nostalgic** → Music Venues, Museums, Bookstores, Antique Shops, Historic Sites
- **Surprise** → Tourist Attractions, Parks, Museums, Restaurants, Entertainment

### Foursquare Category IDs
The app uses specific Foursquare category IDs for precise matching:
- Gym: `18021`
- Park: `16032`
- Restaurant: `13065`
- Café: `13035`
- Bar: `13003`
- Museum: `10027`
- And many more...

## 🔧 Advanced Configuration

### Rate Limiting
The app automatically handles API rate limits:
- Foursquare: 50,000 requests per month (free tier), 2 seconds between calls
- Google Places: 100 requests per 100 seconds (fallback)
- Yelp: 500 requests per day (fallback)

### Search Radius
Default search radius is 10km (6.2 miles). You can modify this in `realPlacesService.ts`.

### Fallback Strategy
If no places are found in the primary categories, the app will:
1. Expand the search radius
2. Try broader categories
3. Fall back to mock data

## 🚨 Troubleshooting

### "API key not configured"
- Check that your `.env` file exists
- Verify API key names match exactly
- Restart your development server

### "Rate limit exceeded"
- The app automatically handles rate limiting
- If you're hitting limits, consider upgrading your API plan

### "No places found"
- Check that your API keys are valid
- Verify the Places API is enabled (Google Cloud Console)
- Check API quotas and billing status

### "CORS errors"
- These APIs don't support browser requests directly
- The app uses Vite's proxy configuration to bypass CORS restrictions
- In development: API calls are proxied through `/api/foursquare` and `/api/google-places`
- In production: You'll need to set up server-side proxying or use a backend service

## 💡 Tips

1. **Start with Google Places** - Most reliable and comprehensive
2. **Use Foursquare as backup** - Good free tier, different data
3. **Monitor your usage** - Check API dashboards regularly
4. **Test with small radius** - Start with 5km to avoid hitting limits
5. **Keep mock data** - Ensures app works even when APIs fail

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Restrict API keys to specific domains/IPs when possible
- Monitor API usage for unexpected charges
- Use environment variables in production deployments

## 📊 Expected Results

With real APIs configured, you'll get:
- **Dynamic recommendations** based on actual nearby places
- **Real-time data** including opening hours, ratings, photos
- **Location accuracy** with precise coordinates and addresses
- **Rich metadata** like price levels, phone numbers, websites
- **Fallback safety** to mock data if APIs fail

The app will automatically detect which APIs are available and use them intelligently, providing a much richer user experience while maintaining reliability.

