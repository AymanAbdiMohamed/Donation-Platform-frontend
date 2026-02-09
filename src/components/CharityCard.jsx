import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Users, Shield, ArrowRight } from "lucide-react";
import DonationModal from "./DonationModal";

/**
 * Reusable Charity Card
 *
 * Props:
 * - charity: charity object
 * - onDonate?: optional override for donate action
 */
function CharityCard({ charity, onDonate }) {
  const [showModal, setShowModal] = useState(false);

  const handleDonate = () => {
    console.log("CharityCard: handleDonate clicked for", charity.name);
    if (onDonate) {
      console.log("CharityCard: Calling onDonate prop");
      onDonate(charity);
    } else {
      console.log("CharityCard: Using internal modal state");
      setShowModal(true);
    }
  };

  const handleDonationSuccess = () => {
    alert("Thank you for your donation!");
  };

  const description =
    charity.missionStatement ||
    charity.mission ||
    charity.description ||
    "No description provided.";

  const girlsReached =
    charity.girlsReachedLastYear || charity.girls_reached;

  // Generate a soft gradient based on charity name for the placeholder
  const nameHash = (charity.name || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradients = [
    "from-rose-100 to-pink-50",
    "from-amber-100 to-orange-50",
    "from-emerald-100 to-teal-50",
    "from-violet-100 to-purple-50",
    "from-sky-100 to-cyan-50",
    "from-fuchsia-100 to-pink-50",
  ];
  const gradient = gradients[nameHash % gradients.length];

  return (
    <>
      <Card className="overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
        {/* Image / Gradient Placeholder */}
        <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
          {charity.image ? (
            <img
              src={charity.image}
              alt={charity.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Heart className="h-10 w-10 text-primary/30" />
              <span className="text-xs font-medium text-primary/40">SheNeeds Partner</span>
            </div>
          )}
          {charity.verified && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-emerald-600 border-0 shadow-sm gap-1 font-medium">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg font-bold leading-tight">
            {charity.name}
          </CardTitle>

          {charity.region && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{charity.region}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow space-y-3">
          <CardDescription className="line-clamp-3 leading-relaxed">
            {description}
          </CardDescription>

          {girlsReached && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg px-2.5 py-1.5 w-fit">
              <Users className="h-3.5 w-3.5" />
              <span>{girlsReached} girls reached</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <Button 
            className="w-full rounded-xl shadow-sm group-hover:shadow-md group-hover:shadow-primary/10 transition-all" 
            onClick={handleDonate}
          >
            <Heart className="h-4 w-4 mr-2" />
            Donate Now
            <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </CardFooter>
      </Card>

      {!onDonate && (
        <DonationModal
          charity={charity}
          open={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleDonationSuccess}
        />
      )}
    </>
  );
}

export default CharityCard;
