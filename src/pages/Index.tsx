import { useState, useEffect } from "react";
import { MoodBoard } from "@/components/MoodBoard";
import { LocationRequest } from "@/components/LocationRequest";
import { LoadingRecommendation } from "@/components/LoadingRecommendation";
import { RecommendationCard } from "@/components/RecommendationCard";
import BuyMeCoffee from "@/components/BuyMeCoffee";
import { getCurrentLocation, getLocationFromZip, UserLocation } from "@/utils/location";
import { getLocationAwareRecommendation, LocationAwareRecommendation } from "@/utils/placesService";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

type AppState = "mood-selection" | "location-request" | "loading" | "recommendation";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<AppState>("mood-selection");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [hasRerolled, setHasRerolled] = useState(false);
  const [recommendation, setRecommendation] = useState<LocationAwareRecommendation | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  // Ensure page always starts in mood-selection state
  useEffect(() => {
    console.log("Index component mounted, setting state to mood-selection");
    
    // Check for any URL parameters that might interfere
    const urlParams = Object.fromEntries(searchParams.entries());
    console.log("URL parameters:", urlParams);
    
    // Clear any persisted state
    localStorage.removeItem("vibepick-state");
    sessionStorage.removeItem("vibepick-state");
    
    // Force reset to mood-selection state
    setState("mood-selection");
    setSelectedMood("");
    setUserLocation(null);
    setHasRerolled(false);
    setRecommendation(null);
    setLocationError("");
  }, [searchParams]);

  // Debug logging
  useEffect(() => {
    console.log("State changed to:", state);
    console.log("Selected mood:", selectedMood);
  }, [state, selectedMood]);

  const handleMoodSelect = (mood: string) => {
    console.log("Mood selected:", mood);
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

  console.log("Rendering content for state:", state);

  if (state === "mood-selection") {
    console.log("Rendering MoodBoard component");
    content = <MoodBoard onMoodSelect={handleMoodSelect} />;
  } else if (state === "location-request") {
    console.log("Rendering LocationRequest component");
    content = (
      <LocationRequest
        onLocationGranted={handleLocationGranted}
        onZipSubmit={handleZipSubmit}
        mood={selectedMood}
        error={locationError}
      />
    );
  } else if (state === "loading") {
    console.log("Rendering LoadingRecommendation component");
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
    console.log("Rendering RecommendationCard component");
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
      <BuyMeCoffee />
    </>
  );
};

export default Index;
