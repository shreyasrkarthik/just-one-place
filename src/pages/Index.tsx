import { useState, useEffect } from "react";
import { LocationRequest } from "@/components/LocationRequest";
import { MoodBoard } from "@/components/MoodBoard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { LoadingRecommendation } from "@/components/LoadingRecommendation";
import { BuyMeCoffee } from "@/components/BuyMeCoffee";
import { getCurrentLocation, getLocationFromZip, type UserLocation } from "@/utils/location";
import { getLocationAwareRecommendation, type LocationAwareRecommendation } from "@/utils/placesService";
import { Button } from "@/components/ui/button";

export const Index = () => {
  const [currentStep, setCurrentStep] = useState<"mood" | "location" | "loading" | "recommendation">("mood");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [userMood, setUserMood] = useState<string>("");
  const [recommendation, setRecommendation] = useState<LocationAwareRecommendation | null>(null);
  const [error, setError] = useState<string>("");

  // Clear any existing state on component mount
  useEffect(() => {
    localStorage.removeItem("vibepick-state");
    sessionStorage.removeItem("vibepick-state");
  }, []);

  const handleMoodSelect = (mood: string) => {
    setUserMood(mood);
    setCurrentStep("location");
  };

  const handleLocationGranted = () => {
    getCurrentLocation()
      .then((location) => {
        setUserLocation(location);
        setCurrentStep("loading");
        setError("");
        
        // Get recommendation immediately after location is obtained
        getLocationAwareRecommendation(userMood, location)
          .then((rec) => {
            setRecommendation(rec);
            setCurrentStep("recommendation");
          })
          .catch((error) => {
            setError("Failed to get recommendation. Please try again.");
            setCurrentStep("location");
          });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleZipSubmit = async (zip: string) => {
    try {
      if (!userMood) {
        setError("Please select a mood first");
        return;
      }
      
      setError("");
      setCurrentStep("loading");
      
      const location = await getLocationFromZip(zip);
      setUserLocation(location);
      
      // Get recommendation immediately after ZIP location is obtained
      const rec = await getLocationAwareRecommendation(userMood, location);
      setRecommendation(rec);
      setCurrentStep("recommendation");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to get location from ZIP code");
      setCurrentStep("location");
    }
  };

  const handleReroll = async () => {
    if (!userLocation || !userMood) return;
    
    setCurrentStep("loading");
    
    try {
      const rec = await getLocationAwareRecommendation(userMood, userLocation, true);
      setRecommendation(rec);
      setCurrentStep("recommendation");
    } catch (error) {
      setError("Failed to get new recommendation. Please try again.");
      setCurrentStep("recommendation");
    }
  };

  const handleStartOver = () => {
    setUserLocation(null);
    setUserMood("");
    setRecommendation(null);
    setError("");
    setCurrentStep("mood");
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "mood":
        return (
          <MoodBoard
            onMoodSelect={handleMoodSelect}
            onBack={() => setCurrentStep("mood")}
          />
        );
      case "location":
        return (
          <LocationRequest
            onLocationGranted={handleLocationGranted}
            onZipSubmit={handleZipSubmit}
            mood={userMood}
            error={error}
          />
        );
      case "loading":
        return <LoadingRecommendation mood={userMood} />;
      case "recommendation":
        if (!recommendation) {
          console.error('❌ No recommendation available, falling back to mood selection');
          return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6">
              <div className="max-w-md w-full space-y-6 text-center">
                <h2 className="text-2xl font-bold">Something went wrong</h2>
                <p className="text-muted-foreground">No recommendation was generated. Let's try again.</p>
                <Button onClick={handleStartOver} variant="action">
                  Start Over
                </Button>
              </div>
            </div>
          );
        }
        console.log('🎯 Rendering recommendation:', recommendation);
        return (
          <RecommendationCard
            recommendation={recommendation}
            onReroll={handleReroll}
            onStartOver={handleStartOver}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentStep()}
      <BuyMeCoffee />
    </div>
  );
};
