/**
 * Admin Dashboard
 * Allows admins to review and approve/reject charity applications
 */
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getPendingApplications, approveApplication, rejectApplication, getPlatformStats } from "@/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, FileText, RefreshCw, Mail, ClipboardList } from "lucide-react";

function AdminDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total_charities: 0,
    approved_count: 0,
    rejected_count: 0,
    pending_count: 0,
    total_donations: 0,
    total_amount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Fetch platform statistics from API
   */
  const fetchStats = useCallback(async () => {
    try {
      const data = await getPlatformStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch platform stats:", err);
    }
  }, []);

  /**
   * Fetch pending applications from API
   */
  const fetchPendingApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPendingApplications();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch pending applications:", err);
      setError("Failed to load pending applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchPendingApplications();
  }, [fetchStats, fetchPendingApplications]);

  /**
   * Handle application approval
   */
  const handleApprove = async (id) => {
    try {
      await approveApplication(id);
      // Remove from local state after successful approval
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Failed to approve application:", err);
      alert("Failed to approve application. Please try again.");
    }
  };

  /**
   * Handle application rejection
   */
  const handleReject = async (id) => {
    try {
      const reason = prompt("Enter rejection reason (optional):") || "";
      await rejectApplication(id, reason);
      // Remove from local state after successful rejection
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Failed to reject application:", err);
      alert("Failed to reject application. Please try again.");
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">Applications awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved_count}</div>
              <p className="text-xs text-muted-foreground">Total approved charities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected_count}</div>
              <p className="text-xs text-muted-foreground">Total rejected applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Applications Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Charity Applications</CardTitle>
                <CardDescription>Review and manage charity applications</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchPendingApplications} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 flex items-center justify-between">
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={fetchPendingApplications}>
                  Retry
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && applications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No pending applications</h3>
                <p className="text-sm text-muted-foreground">
                  All applications have been reviewed. Check back later for new submissions.
                </p>
              </div>
            )}

            {/* Applications List */}
            {!loading && applications.length > 0 && (
              <div className="space-y-4">
                {applications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* TODO: FE2 - Add pagination for applications list when volume increases */}
        {/* TODO: FE3 - Add search/filter functionality for applications */}
      </div>
    </DashboardLayout>
  );
}

/**
 * Application Card Component
 */
function ApplicationCard({ application, onApprove, onReject }) {
  const { id, name, charity_name, email, description, mission } = application;
  
  const displayName = name || charity_name || "Charity Application";
  const displayDescription = description || mission || "No description provided";

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{displayName}</h3>
          <Badge variant="outline" className="mt-1">ID: {id}</Badge>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{email || "N/A"}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {displayDescription}
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => onApprove(id)} size="sm" className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve
        </Button>
        <Button onClick={() => onReject(id)} variant="destructive" size="sm">
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </div>
    </div>
  );
}

export default AdminDashboard;
