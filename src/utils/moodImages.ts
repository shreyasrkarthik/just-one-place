const moodKeywords: Record<string, string[]> = {
  restless: [
    "restless",
    "city-night",
    "wander",
    "stirring",
    "busy-street",
    "jogging",
    "nightlife",
    "crowd",
    "movement",
    "travel"
  ],
  sad: [
    "rain",
    "lonely",
    "melancholy",
    "grey",
    "tears",
    "overcast",
    "solitude",
    "blue",
    "pensive",
    "reflection"
  ],
  romantic: [
    "romance",
    "love",
    "couple",
    "valentine",
    "candlelight",
    "date",
    "sunset",
    "flowers",
    "kiss",
    "together"
  ],
  anxious: [
    "calm",
    "meditation",
    "serene",
    "peace",
    "breath",
    "yoga",
    "nature",
    "water",
    "relax",
    "balance"
  ],
  celebratory: [
    "party",
    "celebration",
    "cheers",
    "fireworks",
    "confetti",
    "birthday",
    "toast",
    "festival",
    "crowd",
    "laugh"
  ],
  bored: [
    "bored",
    "waiting",
    "empty",
    "minimal",
    "monotony",
    "nothing",
    "alone",
    "idle",
    "stare",
    "meh"
  ],
  energetic: [
    "running",
    "dance",
    "workout",
    "jump",
    "music",
    "festival",
    "sports",
    "hiking",
    "party",
    "active"
  ],
  adventurous: [
    "adventure",
    "hiking",
    "mountain",
    "explore",
    "roadtrip",
    "camping",
    "trail",
    "wanderlust",
    "kayak",
    "cliff"
  ],
  nostalgic: [
    "vintage",
    "retro",
    "old",
    "nostalgia",
    "film",
    "classic",
    "antique",
    "memories",
    "record",
    "timeless"
  ],
  surprise: [
    "surprise",
    "confetti",
    "unexpected",
    "random",
    "mystery",
    "gift",
    "wonder",
    "shock",
    "wow",
    "awe"
  ]
};

export const moodImages: Record<string, string[]> = Object.fromEntries(
  Object.entries(moodKeywords).map(([mood, keywords]) => [
    mood,
    keywords.map((keyword, index) =>
      `https://source.unsplash.com/featured/400x300?${encodeURIComponent(keyword)}&sig=${index}`
    )
  ])
);

export const getMoodImage = (mood: string): string => {
  const images = moodImages[mood] || moodImages.surprise;
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

export default moodImages;
