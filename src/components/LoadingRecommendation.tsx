import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LoadingRecommendationProps {
  mood: string;
  moodEmoji: string;
  userLocation?: string;
}

export const LoadingRecommendation = ({ mood, moodEmoji, userLocation }: LoadingRecommendationProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <p className="text-lg text-muted-foreground">
            Your Mood: {moodEmoji} {mood}
          </p>
          {userLocation && (
            <p className="text-sm text-muted-foreground">
              📍 Searching near {userLocation}
            </p>
          )}
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
                <div className="h-full bg-gradient-hero rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Scanning places within 20 miles • Checking hours • Applying mood filter
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Only showing places that are open now</p>
            <p>• No endless lists, just one perfect pick</p>
            <p>• Guaranteed to match your {mood.toLowerCase()} vibe</p>
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