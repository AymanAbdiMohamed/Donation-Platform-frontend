import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Users } from "lucide-react";

function CharityCard({ charity }) {
  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      {/* Image placeholder */}
      <div className="h-32 bg-primary/10 flex items-center justify-center">
        <Heart className="h-12 w-12 text-primary/40" />
      </div>

      {/* Content */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{charity.name}</CardTitle>
          <Badge variant="secondary" className="ml-2">Verified</Badge>
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
          {charity.description || charity.mission || "Helping girls access essential menstrual hygiene products."}
        </CardDescription>
        
        {charity.girls_reached && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
            <Users className="h-3 w-3" />
            <span>{charity.girls_reached} girls reached</span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {/* TODO: FE4 - Implement donation flow */}
        <Button className="w-full">
          <Heart className="h-4 w-4 mr-2" />
          Donate to {charity.name}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CharityCard;
