/**
 * Donor Dashboard
 * Main dashboard for donors to view their activity and make donations
 * 
 * NOTE: This is currently a placeholder. Core functionality to be implemented.
 */
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, History, Star, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";

function DonorDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Donor Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome back!
            </CardTitle>
            <CardDescription>
              Thank you for being part of the SheNeeds community. Your contributions make a real difference.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to={ROUTES.CHARITIES}>
                <Heart className="mr-2 h-4 w-4" />
                Browse Charities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Donated"
            value="$0.00"
            description="Lifetime contributions"
            icon={Heart}
          />
          <StatCard
            title="Charities Supported"
            value="0"
            description="Organizations helped"
            icon={Star}
          />
          <StatCard
            title="Last Donation"
            value="--"
            description="Most recent activity"
            icon={History}
          />
        </div>

        {/* Placeholder Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* TODO: FE1 - Implement donation history list */}
          <PlaceholderCard
            title="Donation History"
            description="Your recent donations will appear here."
            icon={History}
          />

          {/* TODO: FE1 - Implement favorite charities feature */}
          <PlaceholderCard
            title="Favorite Charities"
            description="Save and track your favorite charities."
            icon={Star}
          />
        </div>

        {/* TODO: FE1 - Implement recurring donations management */}
        <PlaceholderCard
          title="Recurring Donations"
          description="Set up and manage recurring donation subscriptions to support charities consistently."
          icon={RefreshCw}
        />
      </div>
    </DashboardLayout>
  );
}

/**
 * Stat Card Component
 * TODO: FE1 - Connect to actual donation data from backend
 */
function StatCard({ title, value, description, icon: Icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Placeholder Card Component
 * Used for sections that are not yet implemented
 */
function PlaceholderCard({ title, description, icon: Icon }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Coming soon</p>
      </CardContent>
    </Card>
  );
}

export default DonorDashboard;
