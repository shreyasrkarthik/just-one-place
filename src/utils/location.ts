export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // For a static website, we'll use mock city/state data
        // In a real app, you'd use reverse geocoding API
        const mockCity = "Your City";
        const mockState = "Your State";
        
        resolve({
          latitude,
          longitude,
          city: mockCity,
          state: mockState
        });
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
  // For a static website, we'll use mock coordinates
  // In a real app, you'd use a ZIP code API
  const mockLocations: Record<string, { lat: number; lng: number; city: string; state: string }> = {
    "78701": { lat: 30.2672, lng: -97.7431, city: "Austin", state: "TX" },
    "78702": { lat: 30.2729, lng: -97.7444, city: "Austin", state: "TX" },
    "78703": { lat: 30.2753, lng: -97.7444, city: "Austin", state: "TX" },
    "78704": { lat: 30.2501, lng: -97.7546, city: "Austin", state: "TX" },
    "78705": { lat: 30.2984, lng: -97.7390, city: "Austin", state: "TX" },
    "10001": { lat: 40.7505, lng: -73.9965, city: "New York", state: "NY" },
    "10002": { lat: 40.7168, lng: -73.9861, city: "New York", state: "NY" },
    "10003": { lat: 40.7326, lng: -73.9896, city: "New York", state: "NY" },
    "90210": { lat: 34.1030, lng: -118.4105, city: "Beverly Hills", state: "CA" },
    "90211": { lat: 34.0668, lng: -118.3801, city: "Los Angeles", state: "CA" },
    "60601": { lat: 41.8857, lng: -87.6225, city: "Chicago", state: "IL" },
    "60602": { lat: 41.8839, lng: -87.6318, city: "Chicago", state: "IL" },
    "60603": { lat: 41.8807, lng: -87.6295, city: "Chicago", state: "IL" },
    "33101": { lat: 25.7743, lng: -80.1937, city: "Miami", state: "FL" },
    "33102": { lat: 25.7867, lng: -80.1334, city: "Miami", state: "FL" },
    "33109": { lat: 25.7907, lng: -80.1300, city: "Miami Beach", state: "FL" }
  };

  const cleanZip = zip.trim().split(/\s+/)[0]; // Take first part if space-separated
  
  if (mockLocations[cleanZip]) {
    const location = mockLocations[cleanZip];
    return {
      latitude: location.lat,
      longitude: location.lng,
      city: location.city,
      state: location.state
    };
  }

  // Fallback for unknown ZIP codes
  return {
    latitude: 30.2672, // Default to Austin
    longitude: -97.7431,
    city: "Your Area",
    state: "Your State"
  };
};

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