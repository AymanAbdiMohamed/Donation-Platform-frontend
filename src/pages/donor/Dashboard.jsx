import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getDonorDashboard, getDonationReceipt } from "../../api/donor";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Heart, Users, Download, ArrowRight, Search, Loader2, FileText, Sparkles } from "lucide-react";
import { formatCurrency, formatCurrencyCompact } from "@/lib/currency";

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
    if (user) fetchDashboardData();
  }, [user]);

  const handleDownloadReceipt = async (donationId) => {
    try {
      const data = await getDonationReceipt(donationId);
      const receipt = data.receipt;
      const lines = [
        `DONATION RECEIPT`,
        `Receipt Number: ${receipt.receipt_number}`,
        `Date: ${receipt.date}`,
        ``,
        `Amount: ${formatCurrency(receipt.amount_dollars || 0)}`,
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

  if (loading) {
    return (
      <DashboardLayout title="Donor Dashboard">
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-[#EC4899] mb-4" />
          <p className="text-[#4B5563] font-medium">Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Donor Dashboard">
        <div className="flex flex-col items-center justify-center py-32">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center max-w-md">
            {error}
          </div>
          <Button variant="outline" className="mt-4 rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8]" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      label: "Total Donated",
      value: formatCurrencyCompact(stats.total_donated_dollars || 0),
      icon: DollarSign,
      color: "text-[#22C55E]",
      bg: "bg-[#dcfce7]",
      gradient: "from-[#22C55E] to-[#16A34A]",
    },
    {
      label: "Donations Made",
      value: stats.donation_count || 0,
      icon: Heart,
      color: "text-[#EC4899]",
      bg: "bg-[#FDF2F8]",
      gradient: "from-[#EC4899] to-[#DB2777]",
    },
    {
      label: "Charities Supported",
      value: stats.charities_supported || 0,
      icon: Users,
      color: "text-[#8B5CF6]",
      bg: "bg-[#f5f3ff]",
      gradient: "from-[#8B5CF6] to-[#7C3AED]",
    },
  ];

  return (
    <DashboardLayout title="Donor Dashboard">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Welcome back,{" "}
          <span className="text-[#EC4899]">
            {user?.username || user?.email?.split("@")[0]}
          </span>
        </h1>
        <p className="text-[#4B5563] mt-1">
          Here&rsquo;s the impact you&rsquo;ve made so far.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <Card
            key={stat.label}
            className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
              <CardTitle className="text-sm font-medium text-[#4B5563]">
                {stat.label}
              </CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold tracking-tight text-[#1F2937]">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Donations + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donations Table */}
        <div className="lg:col-span-2">
          <Card className="border-[#FBB6CE]/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#1F2937]">Recent Donations</CardTitle>
              <Badge className="bg-[#FDF2F8] text-[#EC4899] border-[#FBB6CE]/20 font-medium">
                {recentDonations.length} recent
              </Badge>
            </CardHeader>
            <CardContent>
              {recentDonations.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-[#FBB6CE]/20 rounded-xl bg-[#FDF2F8]/30">
                  <Heart className="h-10 w-10 text-[#FBB6CE]/50 mx-auto mb-3" />
                  <p className="text-[#4B5563] font-medium">
                    You haven&rsquo;t made any donations yet.
                  </p>
                  <Button asChild variant="link" className="mt-2 text-[#EC4899] hover:text-[#DB2777]">
                    <Link to="/browse-charities">
                      Explore Charities
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl border border-[#FBB6CE]/10 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#FDF2F8]/50 text-[#4B5563] text-xs font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Charity</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3 text-center hidden sm:table-cell">Date</th>
                        <th className="px-4 py-3 text-center">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FBB6CE]/10">
                      {recentDonations.map((donation) => (
                        <tr
                          key={donation.id}
                          className="hover:bg-[#FDF2F8]/40 transition-colors"
                        >
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-[#1F2937]">
                              {donation.charity_name || `Charity #${donation.charity_id}`}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-[#22C55E]">
                              {formatCurrency(donation.amount_dollars || 0)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-[#9CA3AF] text-sm text-center hidden sm:table-cell">
                            {donation.created_at
                              ? new Date(donation.created_at).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReceipt(donation.id)}
                              className="h-8 text-xs gap-1 text-[#EC4899] hover:text-[#DB2777] hover:bg-[#FDF2F8]"
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

        {/* Quick Actions Sidebar */}
        <div className="space-y-4">
          <Card className="border-[#FBB6CE]/10">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#1F2937]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full rounded-xl h-11 bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink hover:shadow-pink-lg transition-all" size="lg">
                <Link to="/browse-charities">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Charities
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-xl h-11 border-[#FBB6CE]/30 hover:bg-[#FDF2F8] hover:border-[#EC4899]/30 text-[#1F2937]" size="lg">
                <Link to="/charities">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Charities
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Impact card */}
          <Card className="border-[#EC4899]/20 bg-gradient-to-br from-[#FDF2F8] to-[#FBB6CE]/20 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#EC4899] to-[#DB2777]" />
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#DB2777] flex items-center justify-center mx-auto mb-3 shadow-pink">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <p className="font-bold text-[#1F2937]">Your Impact Matters</p>
              <p className="text-sm text-[#4B5563] mt-1 leading-relaxed">
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
