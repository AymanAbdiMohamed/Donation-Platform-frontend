import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDonorDashboard, getDonationReceipt } from "../../api/donor";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Heart, Users, Download, ArrowRight, Search, Loader2, FileText } from "lucide-react";

/**
 * DONOR DASHBOARD
 *
 * Displays giving impact and recent donation history.
 * Uses GET /donor/dashboard which returns { stats, recent_donations }.
 */
function DonorDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total_donated_dollars: 0,
    donation_count: 0,
    charities_supported: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getDonorDashboard();
        setStats(data.stats || {});
        setRecentDonations(data.recent_donations || []);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout title="Donor Dashboard">
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleDownloadReceipt = async (donationId) => {
    try {
      const data = await getDonationReceipt(donationId);
      const receipt = data.receipt;

      const lines = [
        `DONATION RECEIPT`,
        `Receipt Number: ${receipt.receipt_number}`,
        `Date: ${receipt.date}`,
        ``,
        `Amount: $${(receipt.amount_dollars || 0).toFixed(2)}`,
        `Charity: ${receipt.charity?.name}`,
        `Donor: ${receipt.is_anonymous ? "Anonymous" : receipt.donor?.name}`,
        ``,
        `Anonymous: ${receipt.is_anonymous ? "Yes" : "No"}`,
        `Recurring: ${receipt.is_recurring ? "Yes" : "No"}`,
        receipt.message ? `Message: ${receipt.message}` : "",
        ``,
        `Charity Email: ${receipt.charity?.contact_email || "N/A"}`,
        `Charity Address: ${receipt.charity?.address || "N/A"}`,
        ``,
        `Generated: ${receipt.generated_at}`,
      ]
        .filter(Boolean)
        .join("\n");

      const blob = new Blob([lines], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${receipt.receipt_number}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download receipt:", err);
      alert("Could not download receipt. Please try again.");
    }
  };

  if (error) {
    return (
      <DashboardLayout title="Donor Dashboard">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-center max-w-md">
            {error}
          </div>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      label: "Total Donated",
      value: `$${(stats.total_donated_dollars || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Donations Made",
      value: stats.donation_count || 0,
      icon: Heart,
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      label: "Charities Supported",
      value: stats.charities_supported || 0,
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <DashboardLayout title="Donor Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Welcome back,{" "}
          <span className="text-primary">
            {user?.username || user?.email?.split("@")[0]}
          </span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&rsquo;s the impact you&rsquo;ve made so far.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Donations + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donations Table */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Donations</CardTitle>
              <Badge variant="secondary" className="font-normal">
                {recentDonations.length} recent
              </Badge>
            </CardHeader>
            <CardContent>
              {recentDonations.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                  <Heart className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">
                    You haven&rsquo;t made any donations yet.
                  </p>
                  <Button asChild variant="link" className="mt-2">
                    <Link to="/browse-charities">
                      Explore Charities
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl border border-border/50 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-secondary/50 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Charity</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3 text-center hidden sm:table-cell">Date</th>
                        <th className="px-4 py-3 text-center">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {recentDonations.map((donation) => (
                        <tr
                          key={donation.id}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-foreground">
                              {donation.charity_name ||
                                `Charity #${donation.charity_id}`}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-emerald-600">
                              ${(donation.amount_dollars || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground text-sm text-center hidden sm:table-cell">
                            {donation.created_at
                              ? new Date(
                                  donation.created_at
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReceipt(donation.id)}
                              className="h-8 text-xs gap-1"
                            >
                              <Download className="h-3 w-3" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full rounded-xl h-11 shadow-sm" size="lg">
                <Link to="/browse-charities">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Charities
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-xl h-11" size="lg">
                <Link to="/charities">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Charities
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Impact card */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <p className="font-bold text-foreground">Your Impact Matters</p>
              <p className="text-sm text-muted-foreground mt-1">
                Every donation helps provide essential menstrual hygiene products to girls in need.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DonorDashboard;