import { useState } from "react";
import { MoodBoard } from "@/components/MoodBoard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { getRecommendation } from "@/utils/mockData";
import { toast } from "@/hooks/use-toast";

type AppState = "mood-selection" | "recommendation";

const Index = () => {
  const [state, setState] = useState<AppState>("mood-selection");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [hasRerolled, setHasRerolled] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setHasRerolled(false);
    const rec = getRecommendation(mood);
    setRecommendation(rec);
    setState("recommendation");
    
    toast({
      title: "Perfect! 🎯",
      description: "Found your vibe. Let's see what we got...",
    });
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
    }, 2000);
  };

  const handleReject = () => {
    if (!hasRerolled) {
      const newRec = getRecommendation(selectedMood, true);
      setRecommendation(newRec);
      setHasRerolled(true);
      
      toast({
        title: "Fine. 🙄",
        description: "Clearly you hate happiness. Here's another one.",
      });
    }
  };

  if (state === "mood-selection") {
    return <MoodBoard onMoodSelect={handleMoodSelect} />;
  }

  return (
    <RecommendationCard
      recommendation={recommendation}
      onAccept={handleAccept}
      onReject={handleReject}
      canReroll={!hasRerolled}
    />
  );
};

export default Index;
