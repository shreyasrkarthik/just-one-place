import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, AlertCircle, Info, CheckCircle } from "lucide-react";
import { isUsingMockData } from "@/config/api";

interface LocationRequestProps {
  onLocationGranted: () => void;
  onZipSubmit: (zip: string) => void;
  mood: string;
  error?: string;
}

export const LocationRequest = ({ onLocationGranted, onZipSubmit, mood, error }: LocationRequestProps) => {
  const [showZipInput, setShowZipInput] = useState(false);
  const [zip, setZip] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => onLocationGranted(),
      () => setShowZipInput(true),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleZipSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (zip.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onZipSubmit(zip.trim());
      } finally {
        setIsSubmitting(false);
      }
    }
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

  const usingMockData = isUsingMockData();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
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
              Just One Place needs your location to find amazing places within 20 miles of you for your <span className="font-semibold text-foreground">{mood}</span> mood. 
              No creepy tracking, just good recommendations.
            </p>
          </div>

          {/* API Status Indicator */}
          {usingMockData && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-blue-700 dark:text-blue-300">
              <Info className="w-4 h-4" />
              <div className="text-left">
                <p className="text-sm font-medium">Development Mode</p>
                <p className="text-xs">Using mock data for testing. Limited ZIP code coverage.</p>
              </div>
            </div>
          )}

          {!usingMockData && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-green-700 dark:text-green-300">
              <CheckCircle className="w-4 h-4" />
              <div className="text-left">
                <p className="text-sm font-medium">Full ZIP Code Coverage</p>
                <p className="text-xs">All US ZIP codes supported via OpenCage API</p>
              </div>
            </div>
          )}

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
              onClick={() => setShowZipInput(true)}
              className="w-full text-muted-foreground"
            >
              I'll enter my ZIP code instead
            </Button>

            {showZipInput && (
              <form onSubmit={handleZipSubmit} className="space-y-3 pt-2">
                <div className="flex gap-2">
                  <Input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="Enter ZIP code (e.g., 10001)"
                    className="flex-1"
                    maxLength={10}
                    pattern="^\d{5}(-\d{4})?$"
                  />
                  <Button 
                    type="submit" 
                    variant="action"
                    disabled={isSubmitting || !zip.trim()}
                  >
                    {isSubmitting ? "..." : "Go"}
                  </Button>
                </div>
                
                {/* ZIP Code Help Text */}
                <div className="text-xs text-muted-foreground text-left">
                  <p>• Enter a 5-digit US ZIP code</p>
                  <p>• Format: 10001 or 10001-1234</p>
                  {usingMockData && (
                    <p>• Limited coverage in development mode</p>
                  )}
                  {!usingMockData && (
                    <p>• All US ZIP codes supported</p>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>We only find places that are open right now</span>
          </div>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
          Just One Place finds places within 20 miles • No lists, just one perfect pick
          </p>
          
          {/* API Information */}
          {usingMockData && (
            <div className="text-xs text-muted-foreground">
              <p>💡 Want full ZIP code coverage?</p>
              <p>Get a free API key at <a href="https://opencagedata.com/users/sign_up" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">opencagedata.com</a></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};