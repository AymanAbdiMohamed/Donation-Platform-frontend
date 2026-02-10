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
import { Loader2, CheckCircle, XCircle, Inbox, Shield, Clock, FileText } from "lucide-react";

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

  useEffect(() => { fetchPending(); }, []);

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
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Admin <span className="text-[#EC4899]">Dashboard</span>
          </h1>
          <p className="text-[#4B5563] mt-1">
            Review and manage charity applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 animate-fade-in-up animation-delay-200">
          <Card className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#4B5563]">Pending Reviews</CardTitle>
              <div className="rounded-xl bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/20 p-2">
                <Clock className="h-4 w-4 text-[#F59E0B]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#1F2937]">{applications.length}</div>
              <p className="text-xs text-[#9CA3AF] mt-1">Awaiting your decision</p>
            </CardContent>
          </Card>

          <Card className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#4B5563]">Approved Today</CardTitle>
              <div className="rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/20 p-2">
                <CheckCircle className="h-4 w-4 text-[#22C55E]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#1F2937]">&mdash;</div>
              <p className="text-xs text-[#9CA3AF] mt-1">Keep reviewing applications</p>
            </CardContent>
          </Card>

          <Card className="border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#4B5563]">Your Role</CardTitle>
              <div className="rounded-xl bg-gradient-to-br from-[#EC4899]/10 to-[#EC4899]/20 p-2">
                <Shield className="h-4 w-4 text-[#EC4899]" />
              </div>
            </CardHeader>
            <CardContent>
              <Badge className="capitalize bg-[#FDF2F8] text-[#EC4899] hover:bg-[#FCE7F3] border-[#FBB6CE]/20 font-semibold">
                {user?.role}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card className="border-[#FBB6CE]/10 animate-fade-in-up animation-delay-400">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#DB2777] flex items-center justify-center shadow-pink">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-[#1F2937]">Pending Charity Applications</CardTitle>
                <CardDescription className="text-[#4B5563]">
                  Review and approve or reject charity applications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#EC4899] mr-2" />
                <span className="text-[#4B5563]">Loading applications...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-[#EF4444] p-4 rounded-xl text-center border border-red-100">
                {error}
                <Button variant="outline" size="sm" className="ml-4 border-red-200 hover:bg-red-50" onClick={fetchPending}>
                  Retry
                </Button>
              </div>
            )}

            {!loading && !error && applications.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mx-auto mb-4">
                  <Inbox className="h-8 w-8 text-[#FBB6CE]" />
                </div>
                <p className="text-[#1F2937] font-semibold mb-1">All caught up!</p>
                <p className="text-[#9CA3AF] text-sm">No pending applications to review.</p>
              </div>
            )}

            <div className="space-y-4">
              {applications.map((app, i) => (
                <div
                  key={app.id}
                  className="border border-[#FBB6CE]/10 rounded-xl p-5 space-y-3 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1F2937]">
                        {app.name || app.charity_name || "Charity Application"}
                      </h3>
                      <p className="text-sm text-[#4B5563]">
                        Contact: {app.contact_email || "N/A"}
                      </p>
                    </div>
                    <Badge variant="outline" className="font-mono text-[#9CA3AF] border-[#FBB6CE]/20">
                      #{app.id}
                    </Badge>
                  </div>

                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {app.description || app.mission || "No description provided"}
                  </p>

                  <div className="flex gap-3 pt-2">
                    <Button
                      size="sm"
                      className="bg-[#22C55E] hover:bg-[#16a34a] text-white shadow-sm hover:shadow-md transition-all rounded-xl"
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
                      className="bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-sm hover:shadow-md transition-all rounded-xl"
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
