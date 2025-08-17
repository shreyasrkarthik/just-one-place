import { useState } from "react";
import { MoodBoard } from "@/components/MoodBoard";
import { LocationRequest } from "@/components/LocationRequest";
import { LoadingRecommendation } from "@/components/LoadingRecommendation";
import { RecommendationCard } from "@/components/RecommendationCard";
import Feedback from "@/components/Feedback";
import { getCurrentLocation, UserLocation } from "@/utils/location";
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

  const handleLocationDenied = () => {
    // For now, we'll use a default location (Austin, TX) when denied
    const defaultLocation: UserLocation = {
      latitude: 30.2672,
      longitude: -97.7431,
      city: "Austin",
      state: "TX"
    };
    
    setUserLocation(defaultLocation);
    setState("loading");
    
    setTimeout(async () => {
      const rec = await getLocationAwareRecommendation(selectedMood, defaultLocation);
      setRecommendation(rec);
      setState("recommendation");
      
      toast({
        title: "Using default location",
        description: "Showing recommendations for Austin, TX area",
      });
    }, 1500);
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
        onLocationDenied={handleLocationDenied}
        error={locationError}
      />
    );
  } else if (state === "loading") {
    const moodLabels: Record<string, { label: string; emoji: string }> = {
      restless: { label: "Restless", emoji: "😵" },
      sad: { label: "Sad", emoji: "😔" },
      romantic: { label: "Romantic", emoji: "❤️" },
      anxious: { label: "Anxious", emoji: "🤯" },
      celebratory: { label: "Celebratory", emoji: "🎉" },
      bored: { label: "Bored", emoji: "😴" },
      energetic: { label: "Energetic", emoji: "⚡" },
      adventurous: { label: "Adventurous", emoji: "🗺️" },
      nostalgic: { label: "Nostalgic", emoji: "🕰️" },
      surprise: { label: "Surprise Me", emoji: "🎲" }
    };

    const moodInfo = moodLabels[selectedMood] || moodLabels.surprise;

    content = (
      <LoadingRecommendation
        mood={moodInfo.label}
        moodEmoji={moodInfo.emoji}
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
    </>
  );
};

export default Index;
