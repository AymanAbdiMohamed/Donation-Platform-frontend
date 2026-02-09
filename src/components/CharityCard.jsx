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
import { Heart, MapPin, Users } from "lucide-react";
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
    // Replace with toast if available
    alert("Thank you for your donation!");
  };

  const description =
    charity.missionStatement ||
    charity.mission ||
    charity.description ||
    "No description provided.";

  const girlsReached =
    charity.girlsReachedLastYear || charity.girls_reached;

  return (
    <>
      <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
        {/* Image / Placeholder */}
        <div className="h-32 bg-primary/10 flex items-center justify-center">
          {charity.image ? (
            <img
              src={charity.image}
              alt={charity.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Heart className="h-12 w-12 text-primary/40" />
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{charity.name}</CardTitle>
            {charity.verified && (
              <Badge variant="secondary">Verified</Badge>
            )}
          </div>

          {charity.region && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{charity.region}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-3">
            {description}
          </CardDescription>

          {girlsReached && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
              <Users className="h-3 w-3" />
              <span>{girlsReached} girls reached</span>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button className="w-full" onClick={handleDonate}>
            <Heart className="h-4 w-4 mr-2" />
            Donate
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
