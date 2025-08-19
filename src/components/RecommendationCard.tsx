import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Recommendation {
  name: string;
  address: string;
  reason: string;
  imageUrl: string;
  mapsUrl: string;
  mood: string;
  moodImage: string;
  openHours: string;
  distance: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onReroll: () => void;
  onStartOver: () => void;
}

export const RecommendationCard = ({ 
  recommendation, 
  onReroll, 
  onStartOver
}: RecommendationCardProps) => {
  const handleMapClick = () => {
    window.open(recommendation.mapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-2 flex items-center justify-center gap-2">
            <img src={recommendation.moodImage} alt="mood" className="h-6 w-6" />
            {recommendation.mood}
          </p>
        </div>

        <Card className="overflow-hidden bg-gradient-card shadow-card-custom border-0">
          <div 
            className="h-48 bg-cover bg-center cursor-pointer transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-300 touch-manipulation"
            style={{ backgroundImage: `url(${recommendation.imageUrl})` }}
            onClick={handleMapClick}
          />
          
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-card-foreground">
                {recommendation.name}
              </h2>
              <p className="text-muted-foreground flex items-center gap-1">
                📍 {recommendation.address}
              </p>
              <p className="text-sm text-muted-foreground">
                {recommendation.distance} • {recommendation.openHours}
              </p>
            </div>

            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-accent-foreground font-medium">
                💡 Why: {recommendation.reason}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="action" 
                className="flex-1"
                onClick={onReroll}
              >
                Try Another Place
              </Button>
              <Button 
                variant="secondary-action" 
                className="flex-1"
                onClick={onStartOver}
              >
                Start Over
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={onStartOver}
            className="text-muted-foreground"
          >
            ← Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};