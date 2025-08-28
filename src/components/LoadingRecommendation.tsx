import { Card } from "@/components/ui/card";

interface LoadingRecommendationProps {
  mood: string;
}

export const LoadingRecommendation = ({ mood }: LoadingRecommendationProps) => {
  // Get mood image based on mood string
  const getMoodImage = (mood: string): string => {
    const moodImages: Record<string, string> = {
      restless: "/vibes/restless.png",
      sad: "/vibes/sad.png",
      romantic: "/vibes/romantic.png",
      anxious: "/vibes/anxious.png",
      celebratory: "/vibes/celebratory.png",
      bored: "/vibes/bored.png",
      energetic: "/vibes/energetic.png",
      adventurous: "/vibes/adventorous.png",
      nostalgic: "/vibes/nostalgic.png",
      surprise: "/vibes/surprise.png"
    };
    return moodImages[mood] || "/vibes/surprise.png";
  };

  const moodImage = getMoodImage(mood);
  const moodLabel = mood.charAt(0).toUpperCase() + mood.slice(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
            <img src={moodImage} alt="mood" className="h-6 w-6" /> {moodLabel}
          </p>
        </div>

        <Card className="p-8 bg-gradient-card shadow-card-custom border-0 text-center space-y-6">
          <div className="relative">
            <div className="text-6xl animate-bounce">🎯</div>
            <div className="absolute -top-2 -right-2 text-2xl animate-spin">⚡</div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-card-foreground">
              Finding your perfect spot...
            </h2>
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Scanning places within 10km • Checking hours • Applying mood filter
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Searching within 10km of your location</p>
            <p>• Only showing places that are open now</p>
            <p>• No endless lists, just one perfect pick</p>
            <p>• Guaranteed to match your {moodLabel.toLowerCase()} vibe</p>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            This is where the magic happens ✨
          </p>
        </div>
      </div>
    </div>
  );
};