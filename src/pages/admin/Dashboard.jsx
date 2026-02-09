import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getPendingApplications,
  approveApplication,
  rejectApplication,
} from "../../api/admin";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Inbox } from "lucide-react";

function AdminDashboard() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPendingApplications();
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load pending applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await approveApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to approve application.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      const reason = prompt("Enter rejection reason (optional):") || "";
      setActionLoading(id);
      await rejectApplication(id, reason);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to reject application.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Inbox className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="capitalize">{user?.role}</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Charity Applications</CardTitle>
            <CardDescription>Review and approve or reject charity applications</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span className="text-muted-foreground">Loading applications...</span>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
                {error}
                <Button variant="outline" size="sm" className="ml-4" onClick={fetchPending}>
                  Retry
                </Button>
              </div>
            )}

            {!loading && !error && applications.length === 0 && (
              <div className="text-center py-12">
                <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No pending applications. All caught up!</p>
              </div>
            )}

            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="border rounded-lg p-5 space-y-3 hover:border-primary/30 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {app.name || app.charity_name || "Charity Application"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Contact: {app.contact_email || "N/A"}
                      </p>
                    </div>
                    <Badge variant="outline">#{app.id}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {app.description || app.mission || "No description provided"}
                  </p>

                  <div className="flex gap-3 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(app.id)}
                      disabled={actionLoading === app.id}
                    >
                      {actionLoading === app.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(app.id)}
                      disabled={actionLoading === app.id}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
