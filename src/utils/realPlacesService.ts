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
    BASE_URL: import.meta.env.PROD ? 'https://vibepick.shreyasrk.com/api/foursquare/places' : '/api/foursquare/places', // Use original domain in production
    RATE_LIMIT: 50, // requests per day (free tier)
    API_VERSION: '2025-06-17', // Required API version header
  },
  YELP: {
    API_KEY: import.meta.env.VITE_YELP_API_KEY || '',
    BASE_URL: 'https://api.yelp.com/v3',
    RATE_LIMIT: 500, // requests per day (free tier)
  }
};

// API configuration loaded

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

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    interface GooglePlaceResult {
      place_id: string;
      name: string;
      vicinity: string;
      geometry: { location: { lat: number; lng: number } };
      types: string[];
      rating?: number;
      price_level?: number;
      opening_hours?: { open_now?: boolean };
      photos?: { photo_reference: string }[];
    }

    const results = data.results as GooglePlaceResult[];

    return results.map((place) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      category: place.types[0] || 'establishment',
      rating: place.rating,
      priceLevel: place.price_level ? '$'.repeat(place.price_level) : undefined,
      openNow: place.opening_hours?.open_now,
      photos: place.photos?.map((photo) =>
        `${API_CONFIG.GOOGLE_PLACES.BASE_URL}/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_CONFIG.GOOGLE_PLACES.API_KEY}`
      ),
      distance: getDistanceInMiles(latitude, longitude, place.geometry.location.lat, place.geometry.location.lng)
    }));
  }

  async getPlaceDetails(placeId: string): Promise<unknown> {
    await this.waitForRateLimit();

    const url = `${API_CONFIG.GOOGLE_PLACES.BASE_URL}/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,price_level,opening_hours,website,formatted_phone_number,photos&key=${API_CONFIG.GOOGLE_PLACES.API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();
    return data.result as unknown;
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
    if (!API_CONFIG.FOURSQUARE.API_KEY) {
      throw new Error('Foursquare API key not configured');
    }

    if (API_CONFIG.FOURSQUARE.API_KEY.length < 20) {
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

    // Always use the API route (proxy) to avoid CORS issues
    const url = `${API_CONFIG.FOURSQUARE.BASE_URL}/search?${queryParams.toString()}`;

    // Making API request to Foursquare

    // When using API route (proxy), we don't need auth headers - the proxy handles that
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      await response.text();
      throw new Error(`Foursquare API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    interface FoursquarePlaceResult {
      fsq_place_id: string;
      name: string;
      location?: { formatted_address?: string; locality?: string; region?: string };
      latitude?: number;
      longitude?: number;
      categories?: { name: string }[];
      website?: string;
      tel?: string;
    }

    const results = data.results as FoursquarePlaceResult[];

    return results.map((place) => {
      const address = place.location?.formatted_address ||
                     `${place.location?.locality || ''}, ${place.location?.region || ''}`.trim();

      return {
        id: place.fsq_place_id,
        name: place.name,
        address: address,
        latitude: place.latitude || 0,
        longitude: place.longitude || 0,
        category: place.categories?.[0]?.name || 'establishment',
        rating: undefined,
        priceLevel: undefined,
        openNow: undefined,
        photos: undefined,
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
    
    const allPlaces: RealPlace[] = [];
    
    try {
      // Try Foursquare API first
      if (API_CONFIG.FOURSQUARE.API_KEY) {
        // Try a simple search first without categories to test API connection
        try {
          const testPlaces = await this.foursquareService.searchNearbyPlaces({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            radius,
            keyword: keywords[0] // Use first keyword instead of category
          });
          
          allPlaces.push(...testPlaces);
        } catch (error) {
          // Simple search failed, continue with other methods
        }

        // Search by categories if simple search worked or if we need more results
        if (allPlaces.length < 5) {
          for (const categoryId of foursquareCategories.slice(0, 2)) { // Limit to 2 categories to avoid rate limits
            try {
              const places = await this.foursquareService.searchNearbyPlaces({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                radius,
                category: categoryId
              });
              
              allPlaces.push(...places);
            } catch (error) {
              // Category search failed, continue
            }
          }
        }
        
        // If we don't have enough results, try keyword searches
        if (allPlaces.length < 10) {
          for (const keyword of keywords.slice(0, 2)) { // Try 2 keywords
            try {
              const places = await this.foursquareService.searchNearbyPlaces({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                radius,
                keyword
              });
              
              allPlaces.push(...places);
            } catch (error) {
              // Keyword search failed, continue
            }
          }
        }
      }
      
      // Fallback to Google Places if Foursquare fails or for additional results
      if (allPlaces.length < 5 && API_CONFIG.GOOGLE_PLACES.API_KEY) {
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
        } catch (error) {
          // Google Places search failed
        }
      }
      
    } catch (error) {
      throw new Error('Unable to fetch place recommendations at this time');
    }
    
    if (allPlaces.length === 0) {
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

  async getPlaceDetails(placeId: string, source: 'google' | 'foursquare' = 'google'): Promise<unknown> {
    if (source === 'google' && API_CONFIG.GOOGLE_PLACES.API_KEY) {
      return await this.googleService.getPlaceDetails(placeId);
    }
    
    throw new Error(`Place details not available for source: ${source}`);
  }
}

// Export singleton instance
export const realPlacesService = new RealPlacesService();

