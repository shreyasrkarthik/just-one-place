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
        
        // Try to get city/state from reverse geocoding
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          resolve({
            latitude,
            longitude,
            city: data.city || data.locality,
            state: data.principalSubdivision
          });
        } catch (error) {
          // Fallback without city/state info
          resolve({ latitude, longitude });
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
  let country = "us";
  let code = zip.trim();
  const parts = code.split(/\s+/);
  if (parts.length > 1 && /^[a-zA-Z]{2,}$/i.test(parts[0])) {
    country = parts[0].toLowerCase();
    code = parts.slice(1).join(" ");
  }

  const response = await fetch(`https://api.zippopotam.us/${country}/${encodeURIComponent(code)}`);
  if (!response.ok) {
    throw new Error("Invalid ZIP code");
  }
  const data = await response.json();
  const place = data.places[0];
  return {
    latitude: parseFloat(place.latitude),
    longitude: parseFloat(place.longitude),
    city: place["place name"],
    state: place["state abbreviation"] || place.state
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