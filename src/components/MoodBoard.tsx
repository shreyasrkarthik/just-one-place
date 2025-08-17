import { Button } from "@/components/ui/button";

interface Mood {
  id: string;
  label: string;
  emoji: string;
}

const moods: Mood[] = [
  { id: "restless", label: "Restless", emoji: "😵" },
  { id: "sad", label: "Sad", emoji: "😔" },
  { id: "romantic", label: "Romantic", emoji: "❤️" },
  { id: "anxious", label: "Anxious", emoji: "🤯" },
  { id: "celebratory", label: "Celebratory", emoji: "🎉" },
  { id: "bored", label: "Bored", emoji: "😴" },
  { id: "energetic", label: "Energetic", emoji: "⚡" },
  { id: "adventurous", label: "Adventurous", emoji: "🗺️" },
  { id: "nostalgic", label: "Nostalgic", emoji: "🕰️" },
];

interface MoodBoardProps {
  onMoodSelect: (mood: string) => void;
}

export const MoodBoard = ({ onMoodSelect }: MoodBoardProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
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
            We'll find you the perfect spot
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant="mood"
              onClick={() => onMoodSelect(mood.id)}
              className="h-20 flex-col p-4 text-center"
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </Button>
          ))}
        </div>

        <Button
          variant="action"
          onClick={() => onMoodSelect("surprise")}
          className="w-full h-14 text-lg"
        >
          🎲 Surprise Me
        </Button>

        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            No endless lists. Just one perfect recommendation.
          </p>
          <p className="text-xs text-muted-foreground italic">
            Warning: side effects may include spontaneous fun.
          </p>
        </div>
      </div>
    </div>
  );
};