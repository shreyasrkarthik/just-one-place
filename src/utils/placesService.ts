import { UserLocation, getDistanceInMiles } from "./location";

interface Place {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  openHours?: string;
  imageUrl?: string;
}

// Simulated places database - in real app, this would come from Google Places API
const samplePlaces: Place[] = [
  // Austin area places for demo
  { name: "Zilker Botanical Garden", address: "2220 Barton Springs Rd", latitude: 30.2672, longitude: -97.7731, category: "park" },
  { name: "Sugar Mama's Bakeshop", address: "1905 S 1st St", latitude: 30.2501, longitude: -97.7546, category: "bakery" },
  { name: "BookPeople", address: "603 N Lamar Blvd", latitude: 30.2729, longitude: -97.7530, category: "bookstore" },
  { name: "The Oasis on Lake Travis", address: "6550 Comanche Trail", latitude: 30.3977, longitude: -97.9647, category: "restaurant" },
  { name: "Barton Springs Pool", address: "2201 Barton Springs Rd", latitude: 30.2642, longitude: -97.7731, category: "recreation" },
  { name: "Amy's Ice Cream", address: "1012 W 6th St", latitude: 30.2711, longitude: -97.7545, category: "dessert" },
  { name: "Pinballz Arcade", address: "8940 Research Blvd", latitude: 30.3894, longitude: -97.7394, category: "entertainment" },
  { name: "The Continental Club", address: "1315 S Congress Ave", latitude: 30.2515, longitude: -97.7451, category: "music_venue" },
  
  // Generic places for other cities
  { name: "Local Coffee Roasters", address: "Downtown", latitude: 0, longitude: 0, category: "cafe" },
  { name: "City Art Museum", address: "Museum District", latitude: 0, longitude: 0, category: "museum" },
  { name: "Riverside Park", address: "Riverside Dr", latitude: 0, longitude: 0, category: "park" },
  { name: "The Cozy Bookshop", address: "Main Street", latitude: 0, longitude: 0, category: "bookstore" },
  { name: "Sunset Rooftop Bar", address: "Downtown", latitude: 0, longitude: 0, category: "bar" },
  { name: "Adventure Escape Rooms", address: "Entertainment District", latitude: 0, longitude: 0, category: "entertainment" },
];

const moodToCategories: Record<string, string[]> = {
  restless: ["park", "recreation", "gym"],
  sad: ["bakery", "cafe", "bookstore", "dessert"],
  romantic: ["restaurant", "bar", "park"],
  anxious: ["park", "museum", "bookstore", "cafe"],
  celebratory: ["bar", "restaurant", "entertainment"],
  bored: ["entertainment", "museum", "arcade"],
  energetic: ["gym", "recreation", "music_venue", "bar"],
  adventurous: ["recreation", "entertainment", "park"],
  nostalgic: ["music_venue", "museum", "bookstore"],
  surprise: ["cafe", "restaurant", "entertainment", "park", "museum"]
};

const wittyReasons: Record<string, string[]> = {
  restless: [
    "Movement beats overthinking",
    "Your restless energy needs direction",
    "Time to tire out those racing thoughts"
  ],
  sad: [
    "Sadness + treats = science",
    "Books understand your feelings",
    "Comfort food for the soul",
    "Sometimes sweetness helps"
  ],
  romantic: [
    "Love needs the right atmosphere",
    "Romance requires good vibes",
    "Perfect for starry-eyed moments"
  ],
  anxious: [
    "Calm spaces for anxious minds",
    "Peace is just a visit away",
    "Where worries go to rest"
  ],
  celebratory: [
    "Good times deserve toasts",
    "Victory needs witnesses",
    "Celebrations require proper venues"
  ],
  bored: [
    "Boredom is unchallenged potential",
    "Your entertainment awaits",
    "Time to shake things up"
  ],
  energetic: [
    "Channel that energy wisely",
    "Your vibe needs an outlet",
    "Energy in motion stays in motion"
  ],
  adventurous: [
    "Adventure starts with a step",
    "Your comfort zone is overrated",
    "New experiences await"
  ],
  nostalgic: [
    "Where memories meet the moment",
    "Old souls find their rhythm here",
    "Nostalgia needs the right soundtrack"
  ],
  surprise: [
    "Life's best moments are unplanned",
    "Sometimes surprise is the best choice",
    "Trust the process",
    "Random can be remarkable"
  ]
};

export interface LocationAwareRecommendation {
  name: string;
  address: string;
  reason: string;
  imageUrl: string;
  mapsUrl: string;
  mood: string;
  moodImage: string;
  openHours: string;
  distance: string;
  userLocation: string;
}

export const getLocationAwareRecommendation = async (
  mood: string,
  userLocation: UserLocation,
  reroll: boolean = false
): Promise<LocationAwareRecommendation> => {
  const categories = moodToCategories[mood] || moodToCategories.surprise;
  const reasons = wittyReasons[mood] || wittyReasons.surprise;
  
  // Filter places by category and distance (20 mile limit)
  let relevantPlaces = samplePlaces.filter(place => {
    if (categories.includes(place.category)) {
      // For Austin coordinates, calculate real distance
      if (place.latitude !== 0 && place.longitude !== 0) {
        const distance = getDistanceInMiles(
          userLocation.latitude,
          userLocation.longitude,
          place.latitude,
          place.longitude
        );
        return distance <= 20;
      }
      // For generic places, include them
      return true;
    }
    return false;
  });

  // If no relevant places found, use surprise category
  if (relevantPlaces.length === 0) {
    relevantPlaces = samplePlaces.filter(place => 
      moodToCategories.surprise.includes(place.category)
    );
  }

  // Select place based on reroll
  const placeIndex = reroll ? Math.min(1, relevantPlaces.length - 1) : 0;
  const selectedPlace = relevantPlaces[placeIndex] || relevantPlaces[0];
  
  // Calculate distance for display
  let distanceText = "Nearby";
  if (selectedPlace.latitude !== 0 && selectedPlace.longitude !== 0) {
    const distance = getDistanceInMiles(
      userLocation.latitude,
      userLocation.longitude,
      selectedPlace.latitude,
      selectedPlace.longitude
    );
    distanceText = `${distance.toFixed(1)} miles away`;
  }

  // Generate location-aware address
  const locationText = userLocation.city && userLocation.state 
    ? `${userLocation.city}, ${userLocation.state}`
    : "your area";
    
  const fullAddress = selectedPlace.latitude !== 0 
    ? selectedPlace.address 
    : `${selectedPlace.address}, ${locationText}`;

  // Get mood info
  const moodLabels: Record<string, { label: string; image: string }> = {
    restless: { label: "Restless", image: "/vibes/restless.png" },
    sad: { label: "Sad", image: "/vibes/sad.png" },
    romantic: { label: "Romantic", image: "/vibes/romantic.png" },
    anxious: { label: "Anxious", image: "/vibes/anxious.png" },
    celebratory: { label: "Celebratory", image: "/vibes/celebratory.png" },
    bored: { label: "Bored", image: "/vibes/bored.png" },
    energetic: { label: "Energetic", image: "/vibes/energetic.png" },
    adventurous: { label: "Adventurous", image: "/vibes/adventorous.png" },
    nostalgic: { label: "Nostalgic", image: "/vibes/nostalgic.png" },
    surprise: { label: "Surprise Me", image: "/vibes/surprise.png" }
  };

  const moodInfo = moodLabels[mood] || moodLabels.surprise;
  const reasonIndex = reroll ? Math.min(1, reasons.length - 1) : 0;
  
  return {
    name: selectedPlace.name,
    address: fullAddress,
    reason: reasons[reasonIndex],
    imageUrl: moodInfo.image,
    mapsUrl: `https://maps.apple.com/?q=${encodeURIComponent(selectedPlace.name + " " + fullAddress)}`,
    mood: moodInfo.label,
    moodImage: moodInfo.image,
    openHours: selectedPlace.openHours || "Check hours online",
    distance: distanceText,
    userLocation: locationText
  };
};