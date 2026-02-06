import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Users } from "lucide-react"

/**
 * Reusable Charity Card
 *
 * Props:
 * - charity: charity object
 * - onDonate?: optional callback when Donate is clicked
 */
function CharityCard({ charity, onDonate }) {
  const handleDonate = () => {
    if (onDonate) {
      onDonate(charity)
    }
  }

  return (
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
          {charity.missionStatement ||
            charity.description ||
            "No description provided."}
        </CardDescription>

        {(charity.girlsReachedLastYear || charity.girls_reached) && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
            <Users className="h-3 w-3" />
            <span>
              {charity.girlsReachedLastYear || charity.girls_reached} girls reached
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          onClick={handleDonate}
          disabled={!onDonate}
        >
          <Heart className="h-4 w-4 mr-2" />
          Donate
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CharityCard
