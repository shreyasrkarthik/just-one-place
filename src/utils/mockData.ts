interface MockRecommendation {
  name: string;
  address: string;
  reason: string;
  imageUrl: string;
  mapsUrl: string;
  openHours: string;
  distance: string;
}

const moodRecommendations: Record<string, MockRecommendation[]> = {
  restless: [
    {
      name: "Zilker Botanical Garden",
      address: "2220 Barton Springs Rd, Austin, TX",
      reason: "Walking beats overthinking",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=Zilker+Botanical+Garden",
      openHours: "Open until 7:00 PM",
      distance: "1.2 miles"
    },
    {
      name: "Town Lake Trail",
      address: "S 1st St & Riverside Dr, Austin, TX",
      reason: "Movement is medicine for restless souls",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=Town+Lake+Trail+Austin",
      openHours: "Open 24 hours",
      distance: "0.8 miles"
    }
  ],
  sad: [
    {
      name: "Sugar Mama's Bakeshop",
      address: "1905 S 1st St, Austin, TX",
      reason: "Sadness + cake = science",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=Sugar+Mamas+Bakeshop",
      openHours: "Open until 10:00 PM",
      distance: "1.5 miles"
    },
    {
      name: "BookPeople",
      address: "603 N Lamar Blvd, Austin, TX",
      reason: "Books understand your feelings",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=BookPeople+Austin",
      openHours: "Open until 9:00 PM",
      distance: "2.1 miles"
    }
  ],
  romantic: [
    {
      name: "The Oasis on Lake Travis",
      address: "6550 Comanche Trail, Austin, TX",
      reason: "Sunsets were made for romance",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=The+Oasis+Lake+Travis",
      openHours: "Open until 11:00 PM",
      distance: "18.3 miles"
    }
  ],
  anxious: [
    {
      name: "Umlauf Sculpture Garden",
      address: "605 Azie Morton Rd, Austin, TX",
      reason: "Art soothes anxious minds",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=Umlauf+Sculpture+Garden",
      openHours: "Open until 5:00 PM",
      distance: "3.2 miles"
    }
  ],
  celebratory: [
    {
      name: "Rainey Street",
      address: "Rainey St, Austin, TX",
      reason: "Life's good moments deserve toasts",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=Rainey+Street+Austin",
      openHours: "Open until 2:00 AM",
      distance: "0.5 miles"
    }
  ],
  bored: [
    {
      name: "Pinballz Arcade",
      address: "8940 Research Blvd, Austin, TX",
      reason: "Boredom is just unchallenged potential",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=Pinballz+Arcade+Austin",
      openHours: "Open until midnight",
      distance: "12.4 miles"
    }
  ],
  energetic: [
    {
      name: "6th Street",
      address: "E 6th St, Austin, TX",
      reason: "Energy needs an outlet",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=6th+Street+Austin",
      openHours: "Open until 2:00 AM",
      distance: "1.1 miles"
    }
  ],
  adventurous: [
    {
      name: "Barton Springs Pool",
      address: "2201 Barton Springs Rd, Austin, TX",
      reason: "Adventure starts with a cold plunge",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=Barton+Springs+Pool",
      openHours: "Open until 9:00 PM",
      distance: "2.8 miles"
    }
  ],
  nostalgic: [
    {
      name: "The Continental Club",
      address: "1315 S Congress Ave, Austin, TX",
      reason: "Where old souls find their soundtrack",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=Continental+Club+Austin",
      openHours: "Open until 2:00 AM",
      distance: "2.3 miles"
    }
  ],
  surprise: [
    {
      name: "Amy's Ice Cream",
      address: "1012 W 6th St, Austin, TX",
      reason: "Life's too short for predictable desserts",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=Amys+Ice+Cream+6th+Street",
      openHours: "Open until 11:00 PM",
      distance: "1.7 miles"
    },
    {
      name: "South by Sea",
      address: "2024 E 6th St, Austin, TX",
      reason: "Sometimes you need unexpected oysters",
      imageUrl: "/lovable-uploads/490baa65-3ec1-4eea-83ad-b1f38758491d.png",
      mapsUrl: "https://maps.apple.com/?q=South+by+Sea+Austin",
      openHours: "Open until 10:00 PM",
      distance: "1.9 miles"
    }
  ]
};

const moodLabels: Record<string, { label: string; image: string }> = {
  restless: { label: "Restless", image: "restless.png" },
  sad: { label: "Sad", image: "sad.png" },
  romantic: { label: "Romantic", image: "romantic.png" },
  anxious: { label: "Anxious", image: "anxious.png" },
  celebratory: { label: "Celebratory", image: "celebratory.png" },
  bored: { label: "Bored", image: "bored.png" },
  energetic: { label: "Energetic", image: "energetic.png" },
  adventurous: { label: "Adventurous", image: "adventorous.png" },
  nostalgic: { label: "Nostalgic", image: "nostalgic.png" },
  surprise: { label: "Surprise Me", image: "surprise.png" }
};

export const getRecommendation = (mood: string, reroll: boolean = false): MockRecommendation & { mood: string; moodImage: string } => {
  const recommendations = moodRecommendations[mood] || moodRecommendations.surprise;
  const randomIndex = reroll ? 1 : 0; // Simple reroll logic - use second option if available
  const rec = recommendations[Math.min(randomIndex, recommendations.length - 1)];
  const moodInfo = moodLabels[mood] || moodLabels.surprise;
  
  return {
    ...rec,
    mood: moodInfo.label,
    moodImage: moodInfo.image
  };
};