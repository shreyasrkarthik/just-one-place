export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  zipCode?: string;
}

// OpenCage Geocoding API configuration
const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY || '';
const OPENCAGE_BASE_URL = 'https://api.opencagedata.com/geocode/v1/json';

// Fallback coordinates for error cases (Austin, TX)
const FALLBACK_LOCATION = {
  latitude: 30.2672,
  longitude: -97.7431,
  city: "Austin",
  state: "TX"
};

export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise(async (resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`📍 GPS coordinates obtained: ${latitude}, ${longitude}`);
        
        try {
          // If we have an API key, use reverse geocoding to get city/state
          if (OPENCAGE_API_KEY) {
            console.log('🌐 Using reverse geocoding to get city/state from coordinates...');
            
            const response = await fetch(
              `${OPENCAGE_BASE_URL}?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}&limit=1`
            );

            if (response.ok) {
              const data = await response.json();
              console.log('📡 Reverse geocoding response:', data);

              if (data.results && data.results.length > 0) {
                const result = data.results[0];
                const components = result.components;
                
                console.log('🔍 Reverse geocoding components:', components);

                // Try multiple possible field names for city and state
                const city = components.city || components.town || components.village || components.county || components.suburb || components.neighbourhood;
                const state = components.state_code || components.state || components.province || components.region;

                console.log('📍 Extracted city/state:', { city, state });

                if (city && state) {
                  const location: UserLocation = {
                    latitude,
                    longitude,
                    city,
                    state
                  };
                  
                  console.log('✅ Reverse geocoding successful:', location);
                  resolve(location);
                  return;
                } else {
                  console.warn('⚠️ Missing city or state from reverse geocoding:', { city, state });
                  
                  // Try to extract from formatted address as fallback
                  if (result.formatted) {
                    console.log('🔄 Trying to extract from formatted address:', result.formatted);
                    const addressParts = result.formatted.split(',').map(part => part.trim());
                    
                    if (addressParts.length >= 2) {
                      const potentialCity = addressParts[0];
                      const potentialState = addressParts[addressParts.length - 1];
                      
                      // Basic validation - state should be 2-3 characters, city should be longer
                      if (potentialState.length <= 3 && potentialCity.length > 3) {
                        const fallbackLocation: UserLocation = {
                          latitude,
                          longitude,
                          city: potentialCity,
                          state: potentialState
                        };
                        
                        console.log('✅ Fallback extraction successful:', fallbackLocation);
                        resolve(fallbackLocation);
                        return;
                      }
                    }
                  }
                }
              } else {
                console.warn('⚠️ No results from reverse geocoding API');
              }
            } else {
              console.warn(`⚠️ Reverse geocoding API failed with status: ${response.status}`);
            }
            
            console.warn('⚠️ Reverse geocoding failed, falling back to mock data');
          }

          // Fallback: Use mock city/state data based on coordinates
          // This provides a better experience than "Your City, Your State"
          const mockLocation = getMockLocationFromCoordinates(latitude, longitude);
          if (mockLocation) {
            console.log('📍 Using mock location based on coordinates:', mockLocation);
            resolve(mockLocation);
            return;
          }

          // Final fallback: Use coordinates with generic location
          console.log('🔄 Using generic location as final fallback');
          resolve({
            latitude,
            longitude,
            city: "Your Area",
            state: "Your State"
          });

        } catch (error) {
          console.error('❌ Error in reverse geocoding:', error);
          
          // Try mock location fallback
          const mockLocation = getMockLocationFromCoordinates(latitude, longitude);
          if (mockLocation) {
            console.log('📍 Using mock location fallback:', mockLocation);
            resolve(mockLocation);
            return;
          }

          // Final fallback
          resolve({
            latitude,
            longitude,
            city: "Your Area",
            state: "Your State"
          });
        }
      },
      (error) => {
        let message = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

export const getLocationFromZip = async (zip: string): Promise<UserLocation> => {
  console.log(`🔍 Looking up ZIP code: ${zip}`);
  
  try {
    // Clean the ZIP code input
    const cleanZip = zip.trim().replace(/\s+/g, '');
    console.log(`🧹 Cleaned ZIP code: ${cleanZip}`);
    
    // Basic ZIP code validation (US format: 5 digits or 5+4 format)
    if (!/^\d{5}(-\d{4})?$/.test(cleanZip)) {
      const error = 'Invalid ZIP code format. Please enter a valid 5-digit ZIP code.';
      console.error(`❌ ZIP validation failed: ${error}`);
      throw new Error(error);
    }
    console.log(`✅ ZIP code format validated: ${cleanZip}`);

    // If no API key is configured, fall back to mock data for development
    if (!OPENCAGE_API_KEY) {
      console.warn('⚠️ OpenCage API key not configured. Using mock data.');
      const mockLocation = getMockLocationFromZip(cleanZip);
      console.log('📍 Mock location data:', mockLocation);
      return mockLocation;
    }

    console.log('🌐 Calling OpenCage Geocoding API...');
    
    // Call OpenCage Geocoding API
    const response = await fetch(
      `${OPENCAGE_BASE_URL}?q=${encodeURIComponent(cleanZip)}&countrycode=us&key=${OPENCAGE_API_KEY}&limit=1`
    );

    if (!response.ok) {
      const error = `API request failed: ${response.status}`;
      console.error(`❌ ${error}`);
      throw new Error(error);
    }

    const data = await response.json();
    console.log('📡 API Response received:', data);

    if (!data.results || data.results.length === 0) {
      const error = 'ZIP code not found. Please check and try again.';
      console.error(`❌ ${error}`);
      throw new Error(error);
    }

    const result = data.results[0];
    const components = result.components;
    
    console.log('🔍 API Result details:', {
      geometry: result.geometry,
      components: components,
      formatted: result.formatted
    });

    // Extract location information
    const location: UserLocation = {
      latitude: result.geometry.lat,
      longitude: result.geometry.lng,
      city: components.city || components.town || components.village || components.county,
      state: components.state_code || components.state,
      zipCode: cleanZip
    };

    console.log('📍 Extracted location data:', location);

    // Validate that we got meaningful coordinates
    if (!location.city || !location.state) {
      console.warn('⚠️ Incomplete location data from API, using fallback');
      const fallbackLocation = {
        ...FALLBACK_LOCATION,
        zipCode: cleanZip
      };
      console.log('🔄 Fallback location data:', fallbackLocation);
      return fallbackLocation;
    }

    console.log('✅ Successfully retrieved location from API:', {
      zipCode: cleanZip,
      coordinates: `${location.latitude}, ${location.longitude}`,
      city: location.city,
      state: location.state,
      source: 'OpenCage API'
    });

    return location;

  } catch (error) {
    console.error('❌ Error getting location from ZIP:', error);
    
    // Fallback to mock data for known ZIP codes
    try {
      console.log('🔄 Attempting fallback to mock data...');
      const mockLocation = getMockLocationFromZip(zip);
      console.log('📍 Mock fallback successful:', mockLocation);
      return mockLocation;
    } catch (mockError) {
      console.warn('⚠️ Mock fallback also failed, using default location');
      const defaultLocation = {
        ...FALLBACK_LOCATION,
        zipCode: zip.trim()
      };
      console.log('🔄 Using default fallback location:', defaultLocation);
      return defaultLocation;
    }
  }
};

// Enhanced mock data for development/testing when API is unavailable
const getMockLocationFromZip = (zip: string): UserLocation => {
  console.log(`🎭 Looking up ZIP code ${zip} in mock data...`);
  
  const mockLocations: Record<string, { lat: number; lng: number; city: string; state: string }> = {
    // Austin, TX
    "78701": { lat: 30.2672, lng: -97.7431, city: "Austin", state: "TX" },
    "78702": { lat: 30.2729, lng: -97.7444, city: "Austin", state: "TX" },
    "78703": { lat: 30.2753, lng: -97.7444, city: "Austin", state: "TX" },
    "78704": { lat: 30.2501, lng: -97.7546, city: "Austin", state: "TX" },
    "78705": { lat: 30.2984, lng: -97.7390, city: "Austin", state: "TX" },
    
    // New York, NY
    "10001": { lat: 40.7505, lng: -73.9965, city: "New York", state: "NY" },
    "10002": { lat: 40.7168, lng: -73.9861, city: "New York", state: "NY" },
    "10003": { lat: 40.7326, lng: -73.9896, city: "New York", state: "NY" },
    "10004": { lat: 40.6892, lng: -74.0150, city: "New York", state: "NY" },
    "10005": { lat: 40.7060, lng: -74.0086, city: "New York", state: "NY" },
    
    // Los Angeles, CA
    "90210": { lat: 34.1030, lng: -118.4105, city: "Beverly Hills", state: "CA" },
    "90211": { lat: 34.0668, lng: -118.3801, city: "Los Angeles", state: "CA" },
    "90212": { lat: 34.0736, lng: -118.4000, city: "Los Angeles", state: "CA" },
    "90012": { lat: 34.0614, lng: -118.2386, city: "Los Angeles", state: "CA" },
    "90013": { lat: 34.0454, lng: -118.2434, city: "Los Angeles", state: "CA" },
    
    // Chicago, IL
    "60601": { lat: 41.8857, lng: -87.6225, city: "Chicago", state: "IL" },
    "60602": { lat: 41.8839, lng: -87.6318, city: "Chicago", state: "IL" },
    "60603": { lat: 41.8807, lng: -87.6295, city: "Chicago", state: "IL" },
    "60604": { lat: 41.8756, lng: -87.6274, city: "Chicago", state: "IL" },
    "60605": { lat: 41.8673, lng: -87.6194, city: "Chicago", state: "IL" },
    
    // Miami, FL
    "33101": { lat: 25.7743, lng: -80.1937, city: "Miami", state: "FL" },
    "33102": { lat: 25.7867, lng: -80.1334, city: "Miami", state: "FL" },
    "33109": { lat: 25.7907, lng: -80.1300, city: "Miami Beach", state: "FL" },
    "33125": { lat: 25.7569, lng: -80.2453, city: "Miami", state: "FL" },
    "33126": { lat: 25.7317, lng: -80.2428, city: "Miami", state: "FL" },
    
    // Seattle, WA
    "98101": { lat: 47.6062, lng: -122.3321, city: "Seattle", state: "WA" },
    "98102": { lat: 47.6163, lng: -122.3207, city: "Seattle", state: "WA" },
    "98103": { lat: 47.6915, lng: -122.3427, city: "Seattle", state: "WA" },
    "98104": { lat: 47.6062, lng: -122.3321, city: "Seattle", state: "WA" },
    "98105": { lat: 47.6616, lng: -122.3135, city: "Seattle", state: "WA" },
    
    // Denver, CO
    "80201": { lat: 39.7392, lng: -104.9903, city: "Denver", state: "CO" },
    "80202": { lat: 39.7392, lng: -104.9903, city: "Denver", state: "CO" },
    "80203": { lat: 39.7392, lng: -104.9903, city: "Denver", state: "CO" },
    "80204": { lat: 39.7392, lng: -104.9903, city: "Denver", state: "CO" },
    "80205": { lat: 39.7392, lng: -104.9903, city: "Denver", state: "CO" },
    
    // Portland, OR
    "97201": { lat: 45.5152, lng: -122.6784, city: "Portland", state: "OR" },
    "97202": { lat: 45.5152, lng: -122.6784, city: "Portland", state: "OR" },
    "97203": { lat: 45.5152, lng: -122.6784, city: "Portland", state: "OR" },
    "97204": { lat: 45.5152, lng: -122.6784, city: "Portland", state: "OR" },
    "97205": { lat: 45.5152, lng: -122.6784, city: "Portland", state: "OR" },
    
    // Nashville, TN
    "37201": { lat: 36.1627, lng: -86.7816, city: "Nashville", state: "TN" },
    "37202": { lat: 36.1627, lng: -86.7816, city: "Nashville", state: "TN" },
    "37203": { lat: 36.1627, lng: -86.7816, city: "Nashville", state: "TN" },
    "37204": { lat: 36.1627, lng: -86.7816, city: "Nashville", state: "TN" },
    "37205": { lat: 36.1627, lng: -86.7816, city: "Nashville", state: "TN" },
    
    // San Francisco, CA
    "94102": { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "CA" },
    "94103": { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "CA" },
    "94104": { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "CA" },
    "94105": { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "CA" },
    "94107": { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "CA" }
  };

  const location = mockLocations[zip];
  if (location) {
    const mockLocation: UserLocation = {
      latitude: location.lat,
      longitude: location.lng,
      city: location.city,
      state: location.state,
      zipCode: zip
    };
    
    console.log(`✅ Mock location found for ${zip}:`, {
      coordinates: `${mockLocation.latitude}, ${mockLocation.longitude}`,
      city: mockLocation.city,
      state: mockLocation.state,
      source: 'Mock Data'
    });
    
    return mockLocation;
  }

  // If ZIP not in mock data, throw error to trigger fallback
  console.warn(`⚠️ ZIP code ${zip} not found in mock data`);
  throw new Error(`ZIP code ${zip} not found in mock data`);
};

// Helper function to find the closest mock location based on coordinates
const getMockLocationFromCoordinates = (lat: number, lng: number): UserLocation | null => {
  const mockLocations = [
    { lat: 30.2672, lng: -97.7431, city: "Austin", state: "TX" },
    { lat: 40.7505, lng: -73.9965, city: "New York", state: "NY" },
    { lat: 34.1030, lng: -118.4105, city: "Beverly Hills", state: "CA" },
    { lat: 41.8857, lng: -87.6225, city: "Chicago", state: "IL" },
    { lat: 25.7743, lng: -80.1937, city: "Miami", state: "FL" },
    { lat: 47.6062, lng: -122.3321, city: "Seattle", state: "WA" },
    { lat: 39.7392, lng: -104.9903, city: "Denver", state: "CO" },
    { lat: 45.5152, lng: -122.6784, city: "Portland", state: "OR" },
    { lat: 36.1627, lng: -86.7816, city: "Nashville", state: "TN" },
    { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "CA" }
  ];

  let closestLocation = null;
  let shortestDistance = Infinity;

  for (const location of mockLocations) {
    const distance = getDistanceInMiles(lat, lng, location.lat, location.lng);
    
    // If within 50 miles of a known city, use it
    if (distance <= 50 && distance < shortestDistance) {
      shortestDistance = distance;
      closestLocation = {
        latitude: lat,
        longitude: lng,
        city: location.city,
        state: location.state
      };
    }
  }

  return closestLocation;
};

// Rate limiting utility for API calls
class RateLimiter {
  private lastCall = 0;
  private minInterval = 1000; // 1 second minimum between calls

  async waitForNextCall(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;
    
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastCall)
      );
    }
    
    this.lastCall = Date.now();
  }
}

export const rateLimiter = new RateLimiter();

export const getDistanceInMiles = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};