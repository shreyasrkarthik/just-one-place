import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";

interface Mood {
  id: string;
  label: string;
  image: string;
  tagline: string;
  colors: string[];
}

const moods: Mood[] = [
  {
    id: "restless",
    label: "Restless",
    image: "restless.png",
    tagline: "Burn energy, not brain cells.",
    colors: ["#FFB74D", "#FF8A65"],
  },
  {
    id: "sad",
    label: "Sad",
    image: "sad.png",
    tagline: "Cake therapy, scientifically proven.",
    colors: ["#4FC3F7", "#81D4FA"],
  },
  {
    id: "romantic",
    label: "Romantic",
    image: "romantic.png",
    tagline: "Love is in the air...and also fries.",
    colors: ["#F06292", "#EF5350"],
  },
  {
    id: "anxious",
    label: "Anxious",
    image: "anxious.png",
    tagline: "Breathe in, chill out, snack on.",
    colors: ["#BA68C8", "#9575CD"],
  },
  {
    id: "celebratory",
    label: "Celebratory",
    image: "celebratory.png",
    tagline: "Pop fizz clink—it's party time.",
    colors: ["#FFD54F", "#FFB300"],
  },
  {
    id: "bored",
    label: "Bored",
    image: "bored.png",
    tagline: "Escape the void, one bite at a time.",
    colors: ["#90A4AE", "#B0BEC5"],
  },
  {
    id: "energetic",
    label: "Energetic",
    image: "energetic.png",
    tagline: "Fuel the hype train!",
    colors: ["#81C784", "#66BB6A"],
  },
  {
    id: "adventurous",
    label: "Adventurous",
    image: "adventorous.png",
    tagline: "Because Netflix can wait.",
    colors: ["#4DB6AC", "#26A69A"],
  },
  {
    id: "nostalgic",
    label: "Nostalgic",
    image: "nostalgic.png",
    tagline: "Old-school fun for modern moods.",
    colors: ["#FFAB91", "#FF8A65"],
  },
];

const wildPicks = [
  "Feeling nostalgic? Here’s a retro arcade near you.",
  "Craving chaos? There's a carnival in town.",
  "Need a laugh? Try this comedy club tonight.",
];

interface MoodBoardProps {
  onMoodSelect: (mood: string) => void;
}

export const MoodBoard = ({ onMoodSelect }: MoodBoardProps) => {
  const [surpriseRolling, setSurpriseRolling] = useState(false);
  const [displayMood, setDisplayMood] = useState<Mood | null>(null);
  const [zoomMood, setZoomMood] = useState<Mood | null>(null);
  const rollingRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rollingRef.current) clearInterval(rollingRef.current);
    };
  }, []);

  const triggerConfetti = (colors: string[]) => {
    confetti({ particleCount: 80, spread: 60, colors });
  };

  const handleMood = (mood: Mood) => {
    triggerConfetti(mood.colors);
    setZoomMood(mood);
    setTimeout(() => onMoodSelect(mood.id), 600);
  };

  const handleSurprise = () => {
    setSurpriseRolling(true);
    let i = 0;
    rollingRef.current = window.setInterval(() => {
      setDisplayMood(moods[i % moods.length]);
      i++;
    }, 100);

    setTimeout(() => {
      if (rollingRef.current) clearInterval(rollingRef.current);
      const mood = moods[Math.floor(Math.random() * moods.length)];
      setDisplayMood(mood);
      setSurpriseRolling(false);
      handleMood(mood);
    }, 2000);
  };

  const todayPick = wildPicks[new Date().getDate() % wildPicks.length];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
      {zoomMood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="zoom-anim">
            <div className="flip-card-front h-20 w-32 bg-gradient-mood text-center p-4 rounded-xl shadow-mood flex flex-col items-center justify-center">
              <img
                src={`/vibes/${zoomMood.image}`}
                alt={zoomMood.label}
                className="w-8 h-8 mb-1"
              />
              <span className="text-sm font-medium">{zoomMood.label}</span>
            </div>
          </div>
        </div>
      )}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
            Just One Place
          </h1>
          <p className="text-lg text-muted-foreground">
            Built for the chronically indecisive and the adventurous alike. One mood in, one spot out—no endless scrolling required.
          </p>
        </header>

        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-foreground">
            Pick your vibe 👇
          </h2>
          <p className="text-muted-foreground text-lg">
            We’ll boss you around and send you somewhere cool 😎
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {moods.map((mood) => (
            <div
              key={mood.id}
              className="flip-card h-20"
              onClick={() => handleMood(mood)}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front bg-gradient-mood text-center p-4 rounded-xl shadow-mood flex flex-col items-center justify-center">
                  <img
                    src={`/vibes/${mood.image}`}
                    alt={mood.label}
                    className="w-8 h-8 mb-1"
                  />
                  <span className="text-sm font-medium">{mood.label}</span>
                </div>
                <div className="flip-card-back bg-gradient-mood text-center p-4 rounded-xl shadow-mood flex flex-col items-center justify-center">
                  <span className="text-xs font-medium px-2">
                    {mood.tagline}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold">Today's Wild Pick</h3>
          <div className="bg-gradient-mood p-4 rounded-xl shadow-mood text-sm font-medium rotate-[2deg]">
            {todayPick}
          </div>
        </div>

        <Button
          variant="action"
          onClick={handleSurprise}
          className="relative w-full h-14 text-lg overflow-hidden"
        >
          {surpriseRolling && (
            <img
              src="/vibes/surprise.png"
              alt="dice"
              className="dice-animation absolute top-1/2 -translate-y-1/2"
            />
          )}
          <div className="flex items-center gap-2">
            {displayMood ? (
              <img
                src={`/vibes/${displayMood.image}`}
                alt={displayMood.label}
                className="w-6 h-6"
              />
            ) : (
              <img src="/vibes/surprise.png" alt="surprise" className="w-6 h-6" />
            )}
            <span>{displayMood ? displayMood.label : "Surprise Me"}</span>
          </div>
        </Button>

        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            No endless lists. Just one perfect recommendation.
          </p>
          <p className="text-xs text-muted-foreground italic">
            Side effects may include fun, unexpected adventures, and sugar highs.
          </p>
        </div>
      </div>
    </div>
  );
};