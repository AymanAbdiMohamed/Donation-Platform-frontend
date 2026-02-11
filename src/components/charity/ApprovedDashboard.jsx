/**
 * Approved Charity Dashboard
 * Pink-themed dashboard for approved charities
 */
import { useState, useEffect } from "react";
import {
  getCharityDashboard,
  getReceivedDonations,
  updateCharityProfile,
} from "@/api/charity";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Heart,
  DollarSign,
  Users,
  Loader2,
  Edit2,
  Save,
  X,
  TrendingUp,
} from "lucide-react";
import Carousel from "../../components/Carousel"; // ✅ Carousel import added

export function ApprovedCharityDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [donations, setDonations] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, donationsData] = await Promise.all([
          getCharityDashboard(),
          getReceivedDonations(10),
        ]);
        setDashboard(dashData);
        setDonations(donationsData.donations || []);
        setEditForm({
          name: dashData.charity?.name || "",
          description: dashData.charity?.description || "",
        });
      } catch (err) {
        console.error("Failed to fetch charity data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updated = await updateCharityProfile(editForm);
      setDashboard((prev) => ({ ...prev, charity: updated.charity }));
      setEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-7 w-7 animate-spin text-[#EC4899]" />
          </div>
          <p className="text-[#4B5563]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mx-auto mb-4">
          <X className="h-7 w-7 text-[#EC4899]" />
        </div>
        <p className="text-[#4B5563]">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = dashboard.stats || {};
  const charity = dashboard.charity || {};

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up">
        <Card className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22C55E] to-[#16a34a]" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">
              Total Donations
            </CardTitle>
            <div className="rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/20 p-2">
              <DollarSign className="h-4 w-4 text-[#22C55E]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#1F2937]">
              ${((stats.total_donations || 0) / 100).toFixed(2)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-[#22C55E]" />
              <p className="text-xs text-[#22C55E] font-medium">
                All time revenue
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EC4899] to-[#DB2777]" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">
              Donations Received
            </CardTitle>
            <div className="rounded-xl bg-gradient-to-br from-[#EC4899]/10 to-[#EC4899]/20 p-2">
              <Heart className="h-4 w-4 text-[#EC4899]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-[#1F2937]">
              {stats.donation_count || 0}
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">Total contributions</p>
          </CardContent>
        </Card>

        <Card className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">
              Active Status
            </CardTitle>
            <div className="rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/20 p-2">
              <Users className="h-4 w-4 text-[#8B5CF6]" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                charity.is_active
                  ? "bg-[#dcfce7] text-[#22C55E]"
                  : "bg-red-50 text-[#EF4444]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${charity.is_active ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}
              />
              {charity.is_active ? "Active" : "Inactive"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partners Carousel Section */}
      <div className="animate-fade-in-up animation-delay-300">
        <h2 className="text-xl font-semibold text-[#1F2937] mb-4">
          Our Partners
        </h2>
        <Carousel />
      </div>

      {/* Profile */}
      <Card className="border-[#FBB6CE]/10 animate-fade-in-up animation-delay-200">
        {/* ... rest of your profile JSX remains unchanged ... */}
      </Card>

      {/* Recent Donations */}
      <Card className="border-[#FBB6CE]/10 animate-fade-in-up animation-delay-400">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F8] flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[#EC4899]" />
            </div>
            <div>
              <CardTitle className="text-[#1F2937]">Recent Donations</CardTitle>
              <CardDescription className="text-[#4B5563]">Latest contributions received</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mx-auto mb-3">
                <Heart className="h-7 w-7 text-[#FBB6CE]" />
              </div>
              <p className="text-[#1F2937] font-semibold mb-1">No donations yet</p>
              <p className="text-sm text-[#9CA3AF]">Donations will appear here once received</p>
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((donation, i) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 border border-[#FBB6CE]/10 rounded-xl hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div>
                    <p className="font-medium text-[#1F2937]">
                      {donation.is_anonymous ? "Anonymous Donor" : `Donor #${donation.donor_id}`}
                    </p>
                    {donation.message && (
                      <p className="text-sm text-[#4B5563] mt-1 italic">
                        &quot;{donation.message}&quot;
                      </p>
                    )}
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-bold text-lg text-[#EC4899]">
                    KES {donation.amount_kes.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
