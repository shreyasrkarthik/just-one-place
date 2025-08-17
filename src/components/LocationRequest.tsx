import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, AlertCircle } from "lucide-react";

interface LocationRequestProps {
  onLocationGranted: () => void;
  onLocationDenied: () => void;
  mood: string;
  error?: string;
}

export const LocationRequest = ({ onLocationGranted, onLocationDenied, mood, error }: LocationRequestProps) => {
  const handleRequestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => onLocationGranted(),
      () => onLocationDenied(),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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
  const guideText = guideMessages[mood] ?? "Ready for an adventure?";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <span className="text-3xl">✨</span>
          <p className="text-sm text-center max-w-xs">{guideText}</p>
        </div>
        <Card className="p-8 bg-gradient-card shadow-card-custom border-0 text-center space-y-6">
          <div className="text-6xl">📍</div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-card-foreground">
              Where are you?
            </h2>
            <p className="text-muted-foreground">
            VibePick needs your location to find amazing places within 20 miles of you. 
              No creepy tracking, just good recommendations.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              variant="action" 
              onClick={handleRequestLocation}
              className="w-full h-12"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Share My Location
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onLocationDenied}
              className="w-full text-muted-foreground"
            >
              I'll enter my ZIP code instead
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>We only find places that are open right now</span>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
          VibePick finds places within 20 miles • No lists, just one perfect pick
          </p>
        </div>
      </div>
    </div>
  );
};