import { getMoodImage } from "./moodImages";

interface MockRecommendation {
  name: string;
  address: string;
  reason: string;
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
      mapsUrl: "https://maps.apple.com/?q=Zilker+Botanical+Garden",
      openHours: "Open until 7:00 PM",
      distance: "1.2 miles"
    },
    {
      name: "Town Lake Trail",
      address: "S 1st St & Riverside Dr, Austin, TX",
      reason: "Movement is medicine for restless souls",
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
      mapsUrl: "https://maps.apple.com/?q=Sugar+Mamas+Bakeshop",
      openHours: "Open until 10:00 PM",
      distance: "1.5 miles"
    },
    {
      name: "BookPeople",
      address: "603 N Lamar Blvd, Austin, TX",
      reason: "Books understand your feelings",
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
      mapsUrl: "https://maps.apple.com/?q=Amys+Ice+Cream+6th+Street",
      openHours: "Open until 11:00 PM",
      distance: "1.7 miles"
    },
    {
      name: "South by Sea",
      address: "2024 E 6th St, Austin, TX",
      reason: "Sometimes you need unexpected oysters",
      mapsUrl: "https://maps.apple.com/?q=South+by+Sea+Austin",
      openHours: "Open until 10:00 PM",
      distance: "1.9 miles"
    }
  ]
};

const moodLabels: Record<string, { label: string; emoji: string }> = {
  restless: { label: "Restless", emoji: "😵" },
  sad: { label: "Sad", emoji: "😔" },
  romantic: { label: "Romantic", emoji: "❤️" },
  anxious: { label: "Anxious", emoji: "🤯" },
  celebratory: { label: "Celebratory", emoji: "🎉" },
  bored: { label: "Bored", emoji: "😴" },
  energetic: { label: "Energetic", emoji: "⚡" },
  adventurous: { label: "Adventurous", emoji: "🗺️" },
  nostalgic: { label: "Nostalgic", emoji: "🕰️" },
  surprise: { label: "Surprise Me", emoji: "🎲" }
};

export const getRecommendation = (
  mood: string,
  reroll: boolean = false
): MockRecommendation & { mood: string; moodEmoji: string; imageUrl: string } => {
  const recommendations = moodRecommendations[mood] || moodRecommendations.surprise;
  const randomIndex = reroll ? 1 : 0; // Simple reroll logic - use second option if available
  const rec = recommendations[Math.min(randomIndex, recommendations.length - 1)];
  const moodInfo = moodLabels[mood] || moodLabels.surprise;

  return {
    ...rec,
    imageUrl: getMoodImage(mood),
    mood: moodInfo.label,
    moodEmoji: moodInfo.emoji
  };
};