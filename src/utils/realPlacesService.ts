import { UserLocation, getDistanceInMiles } from "./location";

export interface RealPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  rating?: number;
  priceLevel?: string;
  openNow?: boolean;
  photos?: string[];
  website?: string;
  phone?: string;
  distance: number;
}

export interface PlacesSearchParams {
  latitude: number;
  longitude: number;
  radius: number; // in meters
  category?: string;
  keyword?: string;
  openNow?: boolean;
  priceLevel?: number;
}

// API Configuration
const API_CONFIG = {
  GOOGLE_PLACES: {
    API_KEY: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '',
    BASE_URL: '/api/google-places/maps/api/place', // Use proxy in development
    RATE_LIMIT: 100, // requests per 100 seconds
  },
  FOURSQUARE: {
    API_KEY: import.meta.env.VITE_FOURSQUARE_API_KEY || 'XUNJF22RNH4EYNLLEQGMUZISBOYCXDSF1M0CAAVQJ0WEU4AW',
    BASE_URL: '/api/foursquare/places', // Always use API route (works in both dev and production)
    RATE_LIMIT: 50, // requests per day (free tier)
    API_VERSION: '2025-06-17', // Required API version header
  },
  YELP: {
    API_KEY: import.meta.env.VITE_YELP_API_KEY || '',
    BASE_URL: 'https://api.yelp.com/v3',
    RATE_LIMIT: 500, // requests per day (free tier)
  }
};

// Debug API key configuration on load
console.log('🔑 API Configuration Status:', {
  foursquareConfigured: !!API_CONFIG.FOURSQUARE.API_KEY,
  foursquareKeyLength: API_CONFIG.FOURSQUARE.API_KEY.length,
  foursquareKeyPrefix: API_CONFIG.FOURSQUARE.API_KEY.substring(0, 10) + '...',
  foursquareBaseUrl: API_CONFIG.FOURSQUARE.BASE_URL,
  foursquareApiVersion: API_CONFIG.FOURSQUARE.API_VERSION,
  googleConfigured: !!API_CONFIG.GOOGLE_PLACES.API_KEY,
  yelpConfigured: !!API_CONFIG.YELP.API_KEY
});

// Mood to Foursquare category IDs mapping (Places API v3)
// Reference: https://docs.foursquare.com/data-products/docs/categories
// These are the correct category IDs for Foursquare Places API v3
const moodToFoursquareCategories: Record<string, string[]> = {
  restless: ["4bf58dd8d48988d175941735", "4bf58dd8d48988d163941735", "4bf58dd8d48988d1e2941735"], // Gym, Park, Sports
  sad: ["4bf58dd8d48988d16a941735", "4bf58dd8d48988d16d941735", "4bf58dd8d48988d1e0931735"], // Bakery, Café, Coffee Shop
  romantic: ["4bf58dd8d48988d1c4941735", "4bf58dd8d48988d116941735", "4bf58dd8d48988d163941735"], // Restaurant, Bar, Park
  anxious: ["4bf58dd8d48988d163941735", "4bf58dd8d48988d16d941735", "4bf58dd8d48988d1e0931735"], // Park, Café, Coffee Shop
  celebratory: ["4bf58dd8d48988d116941735", "4bf58dd8d48988d1c4941735", "4bf58dd8d48988d11f941735"], // Bar, Restaurant, Nightclub
  bored: ["4bf58dd8d48988d1e5931735", "4bf58dd8d48988d181941735", "4bf58dd8d48988d17f941735"], // Entertainment, Museum, Movie Theater
  energetic: ["4bf58dd8d48988d175941735", "4bf58dd8d48988d1e2941735", "4bf58dd8d48988d1f6941735"], // Gym, Sports, Dance Studio
  adventurous: ["4bf58dd8d48988d159941735", "4bf58dd8d48988d163941735", "4bf58dd8d48988d1e2941735"], // Outdoor, Park, Sports
  nostalgic: ["4bf58dd8d48988d181941735", "4bf58dd8d48988d1f2931735", "4bf58dd8d48988d114951735"], // Museum, Antique Shop, Historic Site
  surprise: ["4bf58dd8d48988d182941735", "4bf58dd8d48988d163941735", "4bf58dd8d48988d181941735"] // Tourist Attraction, Park, Museum
};

// Fallback keyword-based categories for broader search
const moodToSearchKeywords: Record<string, string[]> = {
  restless: ["gym", "park", "trail", "fitness", "sports"],
  sad: ["bakery", "cafe", "bookstore", "library", "comfort food"],
  romantic: ["restaurant", "bar", "wine bar", "rooftop", "date night"],
  anxious: ["park", "quiet cafe", "library", "meditation", "peaceful"],
  celebratory: ["bar", "restaurant", "nightlife", "celebration", "party"],
  bored: ["entertainment", "arcade", "activities", "fun", "interesting"],
  energetic: ["gym", "dance", "sports", "active", "high energy"],
  adventurous: ["adventure", "outdoor", "hiking", "exploration", "unique"],
  nostalgic: ["vintage", "historic", "classic", "old school", "traditional"],
  surprise: ["unique", "hidden gem", "local favorite", "interesting", "unusual"]
};

// Google Places API integration
export class GooglePlacesService {
  private static instance: GooglePlacesService;
  private lastCall = 0;
  private minInterval = 1000; // 1 second between calls

  static getInstance(): GooglePlacesService {
    if (!GooglePlacesService.instance) {
      GooglePlacesService.instance = new GooglePlacesService();
    }
    return GooglePlacesService.instance;
  }

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastCall)
      );
    }
    
    this.lastCall = Date.now();
  }

  async searchNearbyPlaces(params: PlacesSearchParams): Promise<RealPlace[]> {
    if (!API_CONFIG.GOOGLE_PLACES.API_KEY) {
      throw new Error('Google Places API key not configured');
    }

    await this.waitForRateLimit();

    const { latitude, longitude, radius, category, keyword, openNow, priceLevel } = params;
    
    // Build search query
    let query = `location=${latitude},${longitude}&radius=${radius}`;
    if (category) query += `&type=${category}`;
    if (keyword) query += `&keyword=${encodeURIComponent(keyword)}`;
    if (openNow) query += `&opennow=true`;
    if (priceLevel !== undefined) query += `&maxprice=${priceLevel}`;

    const url = `${API_CONFIG.GOOGLE_PLACES.BASE_URL}/nearbysearch/json?${query}&key=${API_CONFIG.GOOGLE_PLACES.API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      return data.results.map((place: any) => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        category: place.types[0] || 'establishment',
        rating: place.rating,
        priceLevel: place.price_level ? '$'.repeat(place.price_level) : undefined,
        openNow: place.opening_hours?.open_now,
        photos: place.photos?.map((photo: any) => 
          `${API_CONFIG.GOOGLE_PLACES.BASE_URL}/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_CONFIG.GOOGLE_PLACES.API_KEY}`
        ),
        distance: getDistanceInMiles(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng)
      }));

    } catch (error) {
      console.error('Google Places API error:', error);
      throw error;
    }
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    await this.waitForRateLimit();

    const url = `${API_CONFIG.GOOGLE_PLACES.BASE_URL}/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,price_level,opening_hours,website,formatted_phone_number,photos&key=${API_CONFIG.GOOGLE_PLACES.API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Google Places API error:', error);
      throw error;
    }
  }
}

// Foursquare Places API integration
export class FoursquarePlacesService {
  private static instance: FoursquarePlacesService;
  private lastCall = 0;
  private minInterval = 2000; // 2 seconds between calls (free tier)

  static getInstance(): FoursquarePlacesService {
    if (!FoursquarePlacesService.instance) {
      FoursquarePlacesService.instance = new FoursquarePlacesService();
    }
    return FoursquarePlacesService.instance;
  }

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastCall)
      );
    }
    
    this.lastCall = Date.now();
  }

  async searchNearbyPlaces(params: PlacesSearchParams): Promise<RealPlace[]> {
    console.log('🔑 Foursquare API Key Check:', {
      hasKey: !!API_CONFIG.FOURSQUARE.API_KEY,
      keyLength: API_CONFIG.FOURSQUARE.API_KEY.length,
      keyPrefix: API_CONFIG.FOURSQUARE.API_KEY.substring(0, 10)
    });

    if (!API_CONFIG.FOURSQUARE.API_KEY) {
      console.error('❌ Foursquare API key not configured');
      throw new Error('Foursquare API key not configured');
    }

    if (API_CONFIG.FOURSQUARE.API_KEY.length < 20) {
      console.error('❌ Foursquare API key appears to be invalid (too short)');
      throw new Error('Foursquare API key appears to be invalid');
    }

    await this.waitForRateLimit();

    const { latitude, longitude, radius, category, keyword } = params;
    
    // Build query parameters - use the same format as the working curl request
    const queryParams = new URLSearchParams({
      ll: `${latitude},${longitude}`,
      radius: radius.toString(), // Keep in meters, API accepts both
      limit: '50'
    });

    // Add query parameter (equivalent to the curl --query parameter)
    if (keyword) {
      queryParams.append('query', keyword);
    } else if (category) {
      queryParams.append('categories', category);
    }

    const url = `${API_CONFIG.FOURSQUARE.BASE_URL}/search?${queryParams.toString()}`;

    console.log('🔍 Foursquare API request:', {
      url: url.replace(API_CONFIG.FOURSQUARE.API_KEY, 'API_KEY_HIDDEN'),
      parameters: {
        location: `${latitude}, ${longitude}`,
        radius: `${radius}m`,
        category: category || 'None',
        keyword: keyword || 'None',
        limit: '50'
      }
    });

    try {
      // Build headers - don't send auth headers when using API route (it handles auth)
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };
      
      // Only add auth headers if making direct API calls (not through our API route)
      if (url.startsWith('https://')) {
        headers['X-Places-Api-Version'] = API_CONFIG.FOURSQUARE.API_VERSION;
        headers['Authorization'] = `Bearer ${API_CONFIG.FOURSQUARE.API_KEY}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Foursquare API HTTP Error:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText,
          url: url.replace(API_CONFIG.FOURSQUARE.API_KEY, 'API_KEY_HIDDEN')
        });
        throw new Error(`Foursquare API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      console.log('📡 Foursquare API Response:', {
        resultsCount: data.results?.length || 0,
        hasResults: !!data.results,
        responseKeys: Object.keys(data),
        firstResult: data.results?.[0] ? {
          name: data.results[0].name,
          category: data.results[0].categories?.[0]?.name,
          hasLocation: !!data.results[0].latitude
        } : null
      });
      
      if (!data.results || data.results.length === 0) {
        console.log('🔍 No results found from Foursquare API - Full response:', data);
        return [];
      }

      console.log(`✅ Foursquare returned ${data.results.length} places`);
      
      // Log all places returned by Foursquare for debugging
      console.log('📋 Foursquare places details:', data.results.map((place: any, index: number) => ({
        index: index + 1,
        name: place.name,
        category: place.categories?.[0]?.name || 'Unknown',
        address: place.location?.formatted_address || 'No address',
        distance: getDistanceInMiles(
          latitude, 
          longitude, 
          place.latitude || 0, 
          place.longitude || 0
        ).toFixed(1) + ' miles',
        fsqId: place.fsq_place_id
      })));
      
      return data.results.map((place: any) => {
        const address = place.location?.formatted_address || 
                       `${place.location?.locality || ''}, ${place.location?.region || ''}`.trim();
        
        return {
          id: place.fsq_place_id,
          name: place.name,
          address: address,
          latitude: place.latitude || 0,
          longitude: place.longitude || 0,
          category: place.categories?.[0]?.name || 'establishment',
          rating: undefined, // Rating not in basic search response
          priceLevel: undefined, // Price not in basic search response
          openNow: undefined, // Hours not in basic search response
          photos: undefined, // Photos not in basic search response
          website: place.website,
          phone: place.tel,
          distance: getDistanceInMiles(
            latitude, 
            longitude, 
            place.latitude || 0, 
            place.longitude || 0
          )
        };
      });

    } catch (error) {
      console.error('Foursquare API error:', error);
      throw error;
    }
  }
}

// Main service that orchestrates multiple APIs
export class RealPlacesService {
  private googleService: GooglePlacesService;
  private foursquareService: FoursquarePlacesService;

  constructor() {
    this.googleService = GooglePlacesService.getInstance();
    this.foursquareService = FoursquarePlacesService.getInstance();
  }

  async getMoodBasedRecommendations(
    mood: string,
    userLocation: UserLocation,
    radius: number = 10000 // 10km default
  ): Promise<RealPlace[]> {
    const foursquareCategories = moodToFoursquareCategories[mood] || moodToFoursquareCategories.surprise;
    const keywords = moodToSearchKeywords[mood] || moodToSearchKeywords.surprise;
    
    console.log(`🔍 Searching for ${mood} places with Foursquare categories:`, foursquareCategories);
    console.log(`🔍 Keywords for ${mood}:`, keywords);
    
    const allPlaces: RealPlace[] = [];
    
    try {
      // Try Foursquare API first
      if (API_CONFIG.FOURSQUARE.API_KEY) {
        console.log('🚀 Starting Foursquare search...');
        
        // Try a simple search first without categories to test API connection
        try {
          console.log(`🔍 Testing Foursquare API with simple search (no categories)`);
          const testPlaces = await this.foursquareService.searchNearbyPlaces({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            radius,
            keyword: keywords[0] // Use first keyword instead of category
          });
          
          allPlaces.push(...testPlaces);
          console.log(`✅ Found ${testPlaces.length} places with keyword "${keywords[0]}" via Foursquare`);
        } catch (error) {
          console.warn(`⚠️ Foursquare simple search failed:`, error);
        }

        // Search by categories if simple search worked or if we need more results
        if (allPlaces.length < 5) {
          for (const categoryId of foursquareCategories.slice(0, 2)) { // Limit to 2 categories to avoid rate limits
            try {
              console.log(`🔍 Searching Foursquare category: ${categoryId}`);
              const places = await this.foursquareService.searchNearbyPlaces({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                radius,
                category: categoryId
              });
              
              allPlaces.push(...places);
              console.log(`✅ Found ${places.length} places in category ${categoryId} via Foursquare`);
            } catch (error) {
              console.warn(`⚠️ Foursquare category search failed for ${categoryId}:`, error);
            }
          }
        }
        
        // If we don't have enough results, try keyword searches
        if (allPlaces.length < 10) {
          for (const keyword of keywords.slice(0, 2)) { // Try 2 keywords
            try {
              console.log(`🔍 Searching Foursquare keyword: "${keyword}"`);
              const places = await this.foursquareService.searchNearbyPlaces({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                radius,
                keyword
              });
              
              allPlaces.push(...places);
              console.log(`✅ Found ${places.length} places for keyword "${keyword}" via Foursquare`);
            } catch (error) {
              console.warn(`⚠️ Foursquare keyword search failed for "${keyword}":`, error);
            }
          }
        }
      }
      
      // Fallback to Google Places if Foursquare fails or for additional results
      if (allPlaces.length < 5 && API_CONFIG.GOOGLE_PLACES.API_KEY) {
        console.log('🔄 Falling back to Google Places...');
        try {
          // Use the first keyword as a fallback search term for Google
          const places = await this.googleService.searchNearbyPlaces({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            radius,
            keyword: keywords[0],
            openNow: true // Prefer places that are currently open
          });
          
          allPlaces.push(...places);
          console.log(`✅ Found ${places.length} additional places via Google Places`);
        } catch (error) {
          console.warn('⚠️ Google Places API search failed:', error);
        }
      }
      
    } catch (error) {
      console.error('❌ All API searches failed:', error);
      throw new Error('Unable to fetch place recommendations at this time');
    }
    
    if (allPlaces.length === 0) {
      console.log('⚠️ No places found from any API');
      throw new Error('No places found for your location and mood');
    }
    
    // Sort by distance and rating, remove duplicates
    const uniquePlaces = this.removeDuplicates(allPlaces);
    const sortedPlaces = uniquePlaces
      .sort((a, b) => {
        // Prioritize by rating (if available) then by distance
        if (a.rating && b.rating && Math.abs(a.rating - b.rating) > 0.5) {
          return b.rating - a.rating;
        }
        return a.distance - b.distance;
      })
      .slice(0, 10); // Return top 10 results
    
    console.log(`🎯 Final ${sortedPlaces.length} recommendations for ${mood}:`, 
      sortedPlaces.map((place, index) => ({
        rank: index + 1,
        name: place.name,
        category: place.category,
        rating: place.rating || 'No rating',
        distance: `${place.distance.toFixed(1)} miles`,
        address: place.address,
        openNow: place.openNow ? 'Open' : 'Closed/Unknown',
        priceLevel: place.priceLevel || 'No price info',
        hasPhotos: place.photos && place.photos.length > 0,
        hasWebsite: !!place.website,
        hasPhone: !!place.phone,
        fsqId: place.id
      }))
    );
    
    return sortedPlaces;
  }

  private removeDuplicates(places: RealPlace[]): RealPlace[] {
    const seen = new Set<string>();
    return places.filter(place => {
      const key = `${place.name}-${place.latitude}-${place.longitude}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async getPlaceDetails(placeId: string, source: 'google' | 'foursquare' = 'google'): Promise<any> {
    if (source === 'google' && API_CONFIG.GOOGLE_PLACES.API_KEY) {
      return await this.googleService.getPlaceDetails(placeId);
    }
    
    throw new Error(`Place details not available for source: ${source}`);
  }
}

// Export singleton instance
export const realPlacesService = new RealPlacesService();

