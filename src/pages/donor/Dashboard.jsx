/**
 * Donor Dashboard
 * Main dashboard for donors to view their activity and make donations
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDonationHistory } from "@/api/donor";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, History, Star, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";

function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({ total: 0, count: 0, charitiesSupported: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDonationHistory();
        setDonations(data.donations || []);
        
        // Calculate stats
        const total = data.total_donated || 0;
        const count = data.donations?.length || 0;
        const uniqueCharities = new Set(data.donations?.map(d => d.charity_id) || []);
        
        setStats({
          total: total / 100,  // Convert cents to dollars
          count,
          charitiesSupported: uniqueCharities.size
        });
      } catch (err) {
        console.error("Failed to fetch donations:", err);
        setError("Failed to load donation history");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Donor Dashboard">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

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
            value={`$${stats.total.toFixed(2)}`}
            description="Lifetime contributions"
            icon={Heart}
          />
          <StatCard
            title="Charities Supported"
            value={stats.charitiesSupported}
            description="Organizations helped"
            icon={Star}
          />
          <StatCard
            title="Donations Made"
            value={stats.count}
            description="Total transactions"
            icon={History}
          />
        </div>

        {/* Donation History */}
        <Card>
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
            <CardDescription>Your recent contributions</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8 text-muted-foreground">
                {error}
              </div>
            ) : donations.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No donations yet</p>
                <Button asChild variant="outline">
                  <Link to={ROUTES.CHARITIES}>Make your first donation</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        Charity #{donation.charity_id}
                      </p>
                      {donation.message && (
                        <p className="text-sm text-muted-foreground mt-1">
                          &quot;{donation.message}&quot;
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ${donation.amount_dollars.toFixed(2)}
                      </p>
                      {donation.is_anonymous && (
                        <p className="text-xs text-muted-foreground">Anonymous</p>
                      )}
                      {donation.is_recurring && (
                        <p className="text-xs text-primary">Recurring</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

/**
 * Stat Card Component
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

export default DonorDashboard;
