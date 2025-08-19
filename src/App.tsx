import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Custom hook to manage page titles
const usePageTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname;
    let title = "VibePick - One Perfect Recommendation";
    
    if (path === "/") {
      title = "VibePick - One Perfect Recommendation";
    } else {
      title = "Page Not Found - VibePick";
    }
    
    document.title = title;
  }, [location.pathname]);
};

// Component to handle page title updates
const PageTitleHandler = () => {
  usePageTitle();
  return null;
};

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTitleHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
