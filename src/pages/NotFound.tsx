import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found - Just One Place";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <Card className="p-8 bg-gradient-card shadow-card-custom border-0 text-center space-y-6">
          <div className="text-6xl">🤷‍♂️</div>
          
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-card-foreground">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-card-foreground">
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              Oops! The page you're looking for doesn't exist.
            </p>
          </div>

          <Button asChild variant="action" className="w-full">
            <Link to="/">
              Return to Just One Place
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
};
