import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, DollarSign, Globe, Phone } from "lucide-react";

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
  // Real API data
  rating?: number;
  priceLevel?: string;
  openNow?: boolean;
  photos?: string[];
  website?: string;
  phone?: string;
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

  const handleWebsiteClick = () => {
    if (recommendation.website) {
      window.open(recommendation.website, '_blank');
    }
  };

  const handlePhoneClick = () => {
    if (recommendation.phone) {
      window.open(`tel:${recommendation.phone}`, '_self');
    }
  };

  // Use real photos if available, otherwise fall back to mood image
  const displayImage = recommendation.photos && recommendation.photos.length > 0 
    ? recommendation.photos[0] 
    : recommendation.imageUrl;

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
            className="h-48 bg-cover bg-center cursor-pointer transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-300 touch-manipulation relative"
            style={{ backgroundImage: `url(${displayImage})` }}
            onClick={handleMapClick}
          >
            {/* Real API data badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {recommendation.rating && (
                <Badge variant="secondary" className="bg-white/90 text-black">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {recommendation.rating.toFixed(1)}
                </Badge>
              )}
              {recommendation.priceLevel && (
                <Badge variant="secondary" className="bg-white/90 text-black">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {recommendation.priceLevel}
                </Badge>
              )}
            </div>
            
            {/* Open/Closed status */}
            {recommendation.openNow !== undefined && (
              <Badge 
                variant={recommendation.openNow ? "default" : "destructive"}
                className="absolute top-3 right-3"
              >
                <Clock className="h-3 w-3 mr-1" />
                {recommendation.openNow ? "Open Now" : "Closed"}
              </Badge>
            )}
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-card-foreground">
                {recommendation.name}
              </h2>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{recommendation.address}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>📍 {recommendation.distance}</span>
                <span>•</span>
                <span>{recommendation.openHours}</span>
              </div>
            </div>

            {/* Real API metadata */}
            {(recommendation.rating || recommendation.priceLevel || recommendation.website || recommendation.phone) && (
              <div className="bg-accent/20 rounded-lg p-3 space-y-2">
                {recommendation.rating && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{recommendation.rating.toFixed(1)} rating</span>
                  </div>
                )}
                
                {recommendation.priceLevel && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>Price: {recommendation.priceLevel}</span>
                  </div>
                )}
                
                {recommendation.website && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-sm text-blue-600 hover:text-blue-700"
                    onClick={handleWebsiteClick}
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    Visit Website
                  </Button>
                )}
                
                {recommendation.phone && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-sm text-blue-600 hover:text-blue-700"
                    onClick={handlePhoneClick}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    {recommendation.phone}
                  </Button>
                )}
              </div>
            )}

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