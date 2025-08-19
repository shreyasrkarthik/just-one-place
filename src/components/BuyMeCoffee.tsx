import { Button } from "@/components/ui/button";

export const BuyMeCoffee = () => {
  const handleBuyCoffee = () => {
    // Open the Stripe checkout URL in a new tab
    window.open("https://buy.stripe.com/14AcN63K359ldQ8fWCbEA00", "_blank");
  };

  return (
    <Button 
      variant="default" 
      className="fixed bottom-4 left-4 z-50"
      onClick={handleBuyCoffee}
    >
      ☕ Buy me a coffee
    </Button>
  );
};

export default BuyMeCoffee;
