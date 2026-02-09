/**
 * Approved Charity Dashboard
 * Dashboard for approved charities to manage profile and view donations
 */
import { useState, useEffect } from "react";
import { getCharityDashboard, getReceivedDonations, updateCharityProfile } from "@/api/charity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, DollarSign, Users, Loader2, Edit2, Save, X } from "lucide-react";

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
          getReceivedDonations(10)
        ]);
        
        setDashboard(dashData);
        setDonations(donationsData.donations || []);
        setEditForm({
          name: dashData.charity?.name || "",
          description: dashData.charity?.description || ""
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
      setDashboard(prev => ({ ...prev, charity: updated.charity }));
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Failed to load dashboard data
      </div>
    );
  }

  const stats = dashboard.stats || {};
  const charity = dashboard.charity || {};

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Donations"
          value={`$${((stats.total_donations || 0) / 100).toFixed(2)}`}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Donations Received"
          value={stats.donation_count || 0}
          icon={Heart}
          color="primary"
        />
        <StatCard
          title="Active Status"
          value={charity.is_active ? "Active" : "Inactive"}
          icon={Users}
          color="violet"
        />
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Charity Profile</CardTitle>
            {!editing ? (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Charity Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg font-semibold">{charity.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p>{charity.description || "No description provided"}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Latest contributions received</CardDescription>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No donations received yet
            </div>
          ) : (
            <div className="space-y-3">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:border-primary/20 hover:shadow-sm transition-all"
                >
                  <div>
                    <p className="font-medium">
                      {donation.is_anonymous ? "Anonymous Donor" : `Donor #${donation.donor_id}`}
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
                  <p className="font-semibold text-lg">
                    ${donation.amount_dollars.toFixed(2)}
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

function StatCard({ title, value, icon: Icon, color = "primary" }) {
  const colorMap = {
    emerald: "bg-emerald-100 text-emerald-600",
    primary: "bg-primary/10 text-primary",
    violet: "bg-violet-100 text-violet-600",
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-lg p-2 ${colorMap[color] || colorMap.primary}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
