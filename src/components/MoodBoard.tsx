import { useState, useRef, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { trackEvent } from "@/lib/analytics";

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
  const [slotItems, setSlotItems] = useState<string[]>(["Surprise Me"]);
  const [slotAnimating, setSlotAnimating] = useState(false);
  const diceRef = useRef<HTMLImageElement>(null);
  const mascotRef = useRef<HTMLImageElement>(null);
  const defaultGuide = "Hover a mood and I'll talk to you.";
  const [guideText, setGuideText] = useState(defaultGuide);

  const guideMessages: Record<string, string> = {
    restless: "Oh, restless today? Let's burn some calories!",
    sad: "Sad? Don't worry, I've got cake lined up for you 🍰.",
    romantic: "Ooh, romantic? I've got date night plans.",
    anxious: "Anxious? Let's find somewhere chill.",
    celebratory: "Celebrating? Confetti coming right up!",
    bored: "Bored? Not on my watch.",
    energetic: "Energetic? Let's channel that buzz!",
    adventurous: "Feeling bold? Adventure awaits!",
    nostalgic: "Nostalgic? Let's take a trip down memory lane.",
  };

  const handleMoodClick = (mood: Mood) => {
    setGuideText(`Woohoo! ${mood.label}!`);
    mascotRef.current?.classList.add("animate-bounce");
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: [mood.color] });
    setAnimating(mood.id);
    setTimeout(() => {
      mascotRef.current?.classList.remove("animate-bounce");
      setAnimating(null);
      trackEvent("mood_selected", { mood: mood.id });
      onMoodSelect(mood.id);
    }, 600);
  };

  const handleSurprise = () => {
    if (rolling) return;
    trackEvent("surprise_me_clicked");
    setGuideText("Rolling the dice...");
    const finalMood = moods[Math.floor(Math.random() * moods.length)];
    const items = Array.from({ length: 8 }, () => moods[Math.floor(Math.random() * moods.length)].label);
    items.push(finalMood.label);
    setSlotItems(items);
    setRolling(true);
    requestAnimationFrame(() => setSlotAnimating(true));
    diceRef.current?.classList.add("roll-dice");
    setTimeout(() => {
      diceRef.current?.classList.remove("roll-dice");
      setSlotAnimating(false);
      setRolling(false);
      setSlotItems(["Surprise Me"]);
      trackEvent("pageview");
      handleMoodClick(finalMood);
    }, 1000);
  };

  const wildPicks = [
    { text: "Feeling nostalgic? Here's a retro arcade near you.", link: "https://example.com/blog/retro-arcade" },
    { text: "Craving chaos? Try indoor skydiving.", link: "https://example.com/blog/indoor-skydiving" },
    { text: "Need sugar? There's a donut truck around the corner.", link: "https://example.com/blog/donut-truck" },
  ];
  const todayPick = wildPicks[new Date().getDate() % wildPicks.length];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        <header className="text-center space-y-4">
          <h1 className="font-heading text-5xl font-extrabold tracking-tight text-foreground">
            Vibe Pick
          </h1>
        </header>

        <div className="text-center space-y-2">
          <h2 className="font-heading text-4xl font-bold text-foreground">What's your vibe? 👇</h2>
          <p className="text-muted-foreground text-lg">
            We'll boss you around and send you somewhere cool 😎. Don't overthink it.
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <img ref={mascotRef} src="/mascot.svg" alt="mascot" className="h-10 w-10" />
            <p className="text-sm max-w-xs p-2 bg-card/70 rounded-lg shadow">{guideText}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {moods.map((mood) => (
            <div key={mood.id} className="group [perspective:1000px]">
              <Button
                variant="mood"
                onClick={() => handleMoodClick(mood)}
                onMouseEnter={() => setGuideText(guideMessages[mood.id])}
                onMouseLeave={() => setGuideText(defaultGuide)}
                className={`h-24 w-full p-0 relative overflow-hidden ${animating === mood.id ? 'fixed inset-0 z-50 scale-150 flex items-center justify-center text-2xl' : 'text-center'}`}
              >
                <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center [backface-visibility:hidden]">
                    <img
                      src={mood.image}
                      alt={mood.label}
                      className={`w-8 h-8 mb-1 transition-transform duration-500 ${mood.id === 'celebratory' ? 'group-hover:scale-125 group-hover:rotate-12' : ''} ${mood.id === 'energetic' ? 'group-hover:animate-pulse' : ''}`}
                    />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </div>
                  <div className="absolute inset-0 w-full h-full p-2 text-xs leading-tight flex items-center justify-center text-center whitespace-normal break-words overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
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
          <div className="h-6 overflow-hidden mx-auto">
            <div
              className={`slot-list ${slotAnimating ? 'slot-animate' : ''}`}
              style={{ '--items': slotItems.length - 1 } as CSSProperties}
            >
              {slotItems.map((text, i) => (
                <div key={i} className="h-6 flex items-center justify-center">
                  {text}
                </div>
              ))}
            </div>
          </div>
          <img
            ref={diceRef}
            src="/vibes/surprise.png"
            alt="dice"
            className="h-6 w-6 absolute -left-8 top-1/2 -translate-y-1/2"
          />
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
            <h3 className="font-heading text-xl font-bold text-foreground">Today's Wild Pick</h3>
            <a
              href={todayPick.link}
              target="_blank"
              className="block bg-gradient-card p-4 rounded-lg shadow-card-custom hover:shadow-lg transition-shadow"
              onClick={() => trackEvent("daily_pick_clicked")}
            >
              <p className="text-sm text-muted-foreground">{todayPick.text}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}