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
 * Charity Card ??? Pink-themed with hover effects and gradient placeholders.
 */
function CharityCard({ charity, onDonate }) {
  const [showModal, setShowModal] = useState(false);

  const handleDonate = () => {
    if (onDonate) {
      onDonate(charity);
    } else {
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

  // Pink-themed gradients for placeholder
  const nameHash = (charity.name || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradients = [
    "from-[#FDF2F8] to-[#FCE7F3]",
    "from-[#FCE7F3] to-[#FBCFE8]",
    "from-[#FDF2F8] to-[#FEF3C7]",
    "from-[#FCE7F3] to-[#FDF2F8]",
    "from-[#FDF2F8] to-[#F0FDF4]",
    "from-[#FBCFE8] to-[#FDF2F8]",
  ];
  const gradient = gradients[nameHash % gradients.length];

  return (
    <>
      <Card className="overflow-hidden flex flex-col group hover:shadow-pink-lg hover:border-[#EC4899]/20 border-[#FBB6CE]/10 transition-all duration-300 hover:-translate-y-1">
        {/* Image / Gradient Placeholder */}
        <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
          {charity.image ? (
            <img
              src={charity.image}
              alt={charity.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Heart className="h-10 w-10 text-[#EC4899]/30 group-hover:text-[#EC4899]/50 transition-colors duration-300" />
              <span className="text-xs font-medium text-[#EC4899]/40">SheNeeds Partner</span>
            </div>
          )}
          {charity.verified && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-[#22C55E] border-0 shadow-sm gap-1 font-medium backdrop-blur-sm">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          )}
          {/* Pink accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EC4899] via-[#FBB6CE] to-[#EC4899] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-lg font-bold leading-tight text-[#1F2937] group-hover:text-[#EC4899] transition-colors duration-200">
            {charity.name}
          </CardTitle>

          {charity.region && (
            <div className="flex items-center gap-1.5 text-sm text-[#4B5563]">
              <MapPin className="h-3.5 w-3.5 text-[#EC4899]" />
              <span>{charity.region}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow space-y-3">
          <CardDescription className="line-clamp-3 leading-relaxed text-[#4B5563]">
            {description}
          </CardDescription>

          {girlsReached && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#EC4899] bg-[#FDF2F8] rounded-lg px-2.5 py-1.5 w-fit">
              <Users className="h-3.5 w-3.5" />
              <span>{girlsReached} girls reached</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            className="w-full rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-sm group-hover:shadow-pink transition-all duration-300"
            onClick={handleDonate}
          >
            <Heart className="h-4 w-4 mr-2" />
            Donate Now
            <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
