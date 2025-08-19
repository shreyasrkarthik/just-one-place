import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Index } from "./pages/Index";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  useEffect(() => {
    let title = "VibePick - One Perfect Recommendation";
    
    if (currentPath === "/") {
      title = "VibePick - One Perfect Recommendation";
    } else {
      title = "Page Not Found - VibePick";
    }
    
    document.title = title;
  }, [currentPath]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
