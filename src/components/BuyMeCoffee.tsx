import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const donationOptions = [
  { amount: 100, label: "Espresso Shot" },
  { amount: 500, label: "Latte Love" },
  { amount: 2500, label: "Bean Boss" },
];

export const BuyMeCoffee = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDonate = async (amount: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      const stripe = await stripePromise;

      if (data.id) {
        await stripe?.redirectToCheckout({ sessionId: data.id });
      } else {
        throw new Error("No session returned");
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="fixed bottom-4 left-4 z-50">
          Buy me a coffee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fuel the vibes ☕</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {donationOptions.map((option) => (
            <Button
              key={option.amount}
              onClick={() => handleDonate(option.amount)}
              disabled={loading}
              className="w-full"
            >
              {`$${option.amount / 100} - ${option.label}`}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyMeCoffee;
