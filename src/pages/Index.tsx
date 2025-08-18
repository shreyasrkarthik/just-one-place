import { useState } from "react";
import { MoodBoard } from "@/components/MoodBoard";
import { LocationRequest } from "@/components/LocationRequest";
import { LoadingRecommendation } from "@/components/LoadingRecommendation";
import { RecommendationCard } from "@/components/RecommendationCard";
import Feedback from "@/components/Feedback";
import BuyMeCoffee from "@/components/BuyMeCoffee";
import { getCurrentLocation, getLocationFromZip, UserLocation } from "@/utils/location";
import { getLocationAwareRecommendation, LocationAwareRecommendation } from "@/utils/placesService";
import { toast } from "@/hooks/use-toast";

type AppState = "mood-selection" | "location-request" | "loading" | "recommendation";

const Index = () => {
  const [state, setState] = useState<AppState>("mood-selection");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [hasRerolled, setHasRerolled] = useState(false);
  const [recommendation, setRecommendation] = useState<LocationAwareRecommendation | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setHasRerolled(false);
    setState("location-request");
  };

  const handleLocationGranted = async () => {
    setState("loading");
    setLocationError("");
    
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      // Simulate API delay for better UX
      setTimeout(async () => {
        const rec = await getLocationAwareRecommendation(selectedMood, location);
        setRecommendation(rec);
        setState("recommendation");
        
        toast({
          title: "Perfect! 🎯",
          description: `Found a great ${selectedMood} spot near you!`,
        });
      }, 2000);
      
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "Failed to get location");
      setState("location-request");
      toast({
        title: "Location Error",
        description: "Couldn't get your location. Try again or enter your ZIP.",
        variant: "destructive"
      });
    }
  };

  const handleZipSubmit = async (zip: string) => {
    setState("loading");
    setLocationError("");

    try {
      const location = await getLocationFromZip(zip);
      setUserLocation(location);

      setTimeout(async () => {
        const rec = await getLocationAwareRecommendation(selectedMood, location);
        setRecommendation(rec);
        setState("recommendation");

        toast({
          title: "Perfect! 🎯",
          description: `Found a great ${selectedMood} spot near you!`,
        });
      }, 2000);
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "Failed to get location");
      setState("location-request");
      toast({
        title: "Location Error",
        description: "Couldn't get your location. Try again or enter your ZIP.",
        variant: "destructive"
      });
    }
  };

  const handleAccept = () => {
    toast({
      title: "Excellent choice! 🎉",
      description: "Have an amazing time!",
    });
    
    setTimeout(() => {
      setState("mood-selection");
      setRecommendation(null);
      setHasRerolled(false);
      setUserLocation(null);
    }, 2000);
  };

  const handleReject = async () => {
    if (!hasRerolled && userLocation) {
      setState("loading");
      
      setTimeout(async () => {
        const newRec = await getLocationAwareRecommendation(selectedMood, userLocation, true);
        setRecommendation(newRec);
        setHasRerolled(true);
        setState("recommendation");
        
        toast({
          title: "Fine. 🙄",
          description: "Clearly you hate happiness. Here's another one.",
        });
      }, 1500);
    }
  };

  let content;

  if (state === "mood-selection") {
    content = <MoodBoard onMoodSelect={handleMoodSelect} />;
  } else if (state === "location-request") {
    content = (
      <LocationRequest
        onLocationGranted={handleLocationGranted}
        onZipSubmit={handleZipSubmit}
        mood={selectedMood}
        error={locationError}
      />
    );
  } else if (state === "loading") {
    const moodLabels: Record<string, { label: string; image: string }> = {
      restless: { label: "Restless", image: "/vibes/restless.png" },
      sad: { label: "Sad", image: "/vibes/sad.png" },
      romantic: { label: "Romantic", image: "/vibes/romantic.png" },
      anxious: { label: "Anxious", image: "/vibes/anxious.png" },
      celebratory: { label: "Celebratory", image: "/vibes/celebratory.png" },
      bored: { label: "Bored", image: "/vibes/bored.png" },
      energetic: { label: "Energetic", image: "/vibes/energetic.png" },
      adventurous: { label: "Adventurous", image: "/vibes/adventorous.png" },
      nostalgic: { label: "Nostalgic", image: "/vibes/nostalgic.png" },
      surprise: { label: "Surprise Me", image: "/vibes/surprise.png" }
    };

    const moodInfo = moodLabels[selectedMood] || moodLabels.surprise;

    content = (
      <LoadingRecommendation
        mood={moodInfo.label}
        moodImage={moodInfo.image}
        userLocation={
          userLocation?.city && userLocation?.state
            ? `${userLocation.city}, ${userLocation.state}`
            : undefined
        }
      />
    );
  } else {
    content = (
      <RecommendationCard
        recommendation={recommendation!}
        onAccept={handleAccept}
        onReject={handleReject}
        canReroll={!hasRerolled}
      />
    );
  }

  return (
    <>
      {content}
      <Feedback />
      <BuyMeCoffee />
    </>
  );
};

export default Index;
