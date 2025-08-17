import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface Mood {
  id: string;
  label: string;
  image: string;
  tagline: string;
  color: string;
}

const moods: Mood[] = [
  {
    id: "restless",
    label: "Restless",
    image: "/vibes/restless.png",
    tagline: "Burn energy, not brain cells.",
    color: "#ff6b6b",
  },
  {
    id: "sad",
    label: "Sad",
    image: "/vibes/sad.png",
    tagline: "Cake therapy, scientifically proven.",
    color: "#5dade2",
  },
  {
    id: "romantic",
    label: "Romantic",
    image: "/vibes/romantic.png",
    tagline: "Love is in the air (and the menu).",
    color: "#ff9ff3",
  },
  {
    id: "anxious",
    label: "Anxious",
    image: "/vibes/anxious.png",
    tagline: "Deep breaths, delicious bites.",
    color: "#feca57",
  },
  {
    id: "celebratory",
    label: "Celebratory",
    image: "/vibes/celebratory.png",
    tagline: "Confetti & cake? Yes please.",
    color: "#1dd1a1",
  },
  {
    id: "bored",
    label: "Bored",
    image: "/vibes/bored.png",
    tagline: "Boredom? Never heard of her.",
    color: "#c8d6e5",
  },
  {
    id: "energetic",
    label: "Energetic",
    image: "/vibes/energetic.png",
    tagline: "Ride the buzz.",
    color: "#f368e0",
  },
  {
    id: "adventurous",
    label: "Adventurous",
    image: "/vibes/adventorous.png",
    tagline: "Because Netflix can wait.",
    color: "#ffb142",
  },
  {
    id: "nostalgic",
    label: "Nostalgic",
    image: "/vibes/nostalgic.png",
    tagline: "Travel back, one bite at a time.",
    color: "#48dbfb",
  },
];

interface MoodBoardProps {
  onMoodSelect: (mood: string) => void;
}

export const MoodBoard = ({ onMoodSelect }: MoodBoardProps) => {
  const [animating, setAnimating] = useState<string | null>(null);
  const [rolling, setRolling] = useState(false);
  const [slotText, setSlotText] = useState("Surprise Me");
  const diceRef = useRef<HTMLImageElement>(null);

  const handleMoodClick = (mood: Mood) => {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: [mood.color] });
    setAnimating(mood.id);
    setTimeout(() => {
      setAnimating(null);
      onMoodSelect(mood.id);
    }, 600);
  };

  const handleSurprise = () => {
    setRolling(true);
    const interval = setInterval(() => {
      const m = moods[Math.floor(Math.random() * moods.length)];
      setSlotText(m.label);
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      const m = moods[Math.floor(Math.random() * moods.length)];
      setSlotText(m.label);
      diceRef.current?.classList.add("roll-dice");
      setTimeout(() => {
        diceRef.current?.classList.remove("roll-dice");
        setRolling(false);
        handleMoodClick(m);
      }, 1000);
    }, 1000);
  };

  const wildPicks = [
    "Feeling nostalgic? Here's a retro arcade near you.",
    "Craving chaos? Try indoor skydiving.",
    "Need sugar? There's a donut truck around the corner.",
  ];
  const todayPick = wildPicks[new Date().getDate() % wildPicks.length];

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
            Just One Place
          </h1>
        </header>

        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-foreground">Pick your vibe 👇</h2>
          <p className="text-muted-foreground text-lg">
            We'll boss you around and send you somewhere cool 😎.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {moods.map((mood) => (
            <div key={mood.id} className="group [perspective:1000px]">
              <Button
                variant="mood"
                onClick={() => handleMoodClick(mood)}
                className={`h-24 w-full p-0 relative ${animating === mood.id ? 'fixed inset-0 z-50 scale-150 flex items-center justify-center text-2xl' : 'text-center'}`}
              >
                <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center [backface-visibility:hidden]">
                    <img src={mood.image} alt={mood.label} className="w-8 h-8 mb-1" />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </div>
                  <div className="absolute inset-0 p-2 text-xs flex items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {mood.tagline}
                  </div>
                </div>
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="action"
          onClick={rolling ? undefined : handleSurprise}
          className="w-full h-14 text-lg relative overflow-hidden"
        >
          <span>{slotText}</span>
          <img ref={diceRef} src="/vibes/surprise.png" alt="dice" className="h-6 w-6 absolute -left-8 top-1/2 -translate-y-1/2" />
        </Button>

        <div className="text-center space-y-4">
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">
              No endless lists. Just one perfect recommendation.
            </p>
            <p className="text-xs text-muted-foreground italic">
              Side effects may include fun, unexpected adventures, and sugar highs.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">Today's Wild Pick</h3>
            <div className="bg-gradient-card p-4 rounded-lg shadow-card-custom">
              <p className="text-sm text-muted-foreground">{todayPick}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};