import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/toast";
import { ROUTES } from "../../constants";
import {
  getApplications,
  approveApplication,
  rejectApplication,
  getPlatformStats,
} from "../../api/admin";
import { Check, X, Eye, Search, RefreshCw, LogOut, Loader2, DollarSign, Users, Building2, Clock } from "lucide-react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Textarea,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { formatCurrency } from "@/lib/currency";

/* ── Stats Card ─────────────────────────────────────────────── */
function StatsCard({ title, value, desc, icon: Icon, highlight }) {
  return (
    <Card className={`border ${highlight ? "border-[#EC4899]/30 bg-[#FDF2F8]/30" : "border-[#FBB6CE]/10"}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[#4B5563]">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-[#EC4899]" />}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-extrabold text-[#1F2937]">{value}</p>
        <p className="text-xs text-[#9CA3AF] mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}

/* ── Detail Row ─────────────────────────────────────────────── */
function DetailItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-[#FBB6CE]/10 last:border-0">
      <span className="text-sm font-medium text-[#4B5563]">{label}</span>
      <span className="text-sm text-[#1F2937] text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedApp, setSelectedApp] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, appsData] = await Promise.all([
        getPlatformStats(),
        getApplications()
      ]);
      setStats(statsData);
      setApplications(appsData.applications || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Backend uses "submitted" for pending applications
  const statusMap = { pending: "submitted", approved: "approved", rejected: "rejected" };
  const filteredApplications = applications.filter(app => {
    const matchesTab = app.status === statusMap[activeTab] || app.status === activeTab;
    const matchesSearch = !searchQuery ||
      app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.charity_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApprove = async (id) => {
    if (!confirm("Are you sure you want to approve this application?")) return;
    setActionLoading(id);
    try {
      await approveApplication(id);
      toast.success("Application Approved", "The charity has been approved and notified.");
      await fetchData();
    } catch (err) {
      toast.error("Approval Failed", err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      await rejectApplication(selectedApp.id, rejectionReason);
      setIsRejectModalOpen(false);
      setRejectionReason("");
      setSelectedApp(null);
      toast.success("Application Rejected", "The charity has been notified.");
      await fetchData();
    } catch (err) {
      toast.error("Rejection Failed", err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (app) => {
    setSelectedApp(app);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };
  
  const openDetailModal = (app) => {
    setSelectedApp(app);
    setIsDetailModalOpen(true);
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#EC4899]" />
      </div>
    );
  }

  const pendingCount = stats?.pending_count || 0;

  return (
    <div className="min-h-screen bg-[#FDF2F8]/30 p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1F2937]">Admin Dashboard</h1>
          <p className="text-[#4B5563] mt-1">Manage charity applications and platform overview.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchData} variant="outline" size="sm" className="gap-2 rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8]">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              logout();
              navigate(ROUTES.LOGIN);
            }}
            className="flex items-center gap-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={DollarSign} title="Total Donations" value={formatCurrency(stats?.total_donations_kes || 0)} desc="Lifetime platform volume" />
        <StatsCard icon={Clock} title="Pending Applications" value={pendingCount} desc="Requires review" highlight={pendingCount > 0} />
        <StatsCard icon={Building2} title="Active Charities" value={stats?.total_charities || 0} desc="Approved organizations" />
        <StatsCard icon={Users} title="Total Donors" value={stats?.total_donors || 0} desc="Registered donors" />
      </div>

      {/* Applications Management */}
      <Card className="border-[#FBB6CE]/10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-[#1F2937]">Charity Applications</CardTitle>
              <CardDescription className="text-[#4B5563]">Review and manage charity applications</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                Pending
                {pendingCount > 0 && (
                  <Badge className="ml-2 bg-[#EC4899] text-white text-xs">{pendingCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12 text-[#4B5563]">
                  <p className="font-medium">No {activeTab} applications found.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-[#FBB6CE]/10 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#FDF2F8]/50 text-[#4B5563] text-xs font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Organization</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                        <th className="px-4 py-3 hidden md:table-cell">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FBB6CE]/10">
                      {filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-[#FDF2F8]/40 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-semibold text-[#1F2937]">
                              {app.charity_name || app.name || `Application #${app.id}`}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#4B5563] hidden sm:table-cell">
                            {app.email || app.contact_email || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#9CA3AF] hidden md:table-cell">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={
                                app.status === "approved"
                                  ? "bg-[#dcfce7] text-[#166534] border-0"
                                  : app.status === "rejected"
                                  ? "bg-red-50 text-red-700 border-0"
                                  : "bg-[#FDF2F8] text-[#EC4899] border-0"
                              }
                            >
                              {app.status === "submitted" ? "pending" : app.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDetailModal(app)}
                                className="h-8 w-8 p-0 text-[#4B5563] hover:text-[#EC4899] hover:bg-[#FDF2F8]"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {(app.status === "pending" || app.status === "submitted") && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApprove(app.id)}
                                    disabled={actionLoading === app.id}
                                    className="h-8 w-8 p-0 text-[#22C55E] hover:text-[#16A34A] hover:bg-[#dcfce7]"
                                    title="Approve"
                                  >
                                    {actionLoading === app.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openRejectModal(app)}
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    title="Reject"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-md border-[#FBB6CE]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Reject Application</DialogTitle>
            <DialogDescription className="text-[#4B5563]">
              Provide a reason for rejecting {selectedApp?.charity_name || selectedApp?.name || "this application"}.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional)..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px] border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl"
          />
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
              className="rounded-xl border-[#FBB6CE]/30"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={actionLoading}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg border-[#FBB6CE]/20">
          <DialogHeader>
            <DialogTitle className="text-[#1F2937]">Application Details</DialogTitle>
            <DialogDescription className="text-[#4B5563]">
              Review the full application details below.
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              <DetailItem label="Organization" value={selectedApp.charity_name || selectedApp.name} />
              <DetailItem label="Email" value={selectedApp.email || selectedApp.contact_email} />
              <DetailItem label="Phone" value={selectedApp.phone_number} />
              <DetailItem label="Registration #" value={selectedApp.registration_number} />
              <DetailItem label="Country" value={selectedApp.country_of_operation} />
              <DetailItem label="Region Served" value={selectedApp.region_served} />
              <DetailItem label="Mission" value={selectedApp.mission_statement} />
              <DetailItem label="Target Age Group" value={selectedApp.target_age_group} />
              <DetailItem label="Programme" value={selectedApp.menstrual_health_programme} />
              <DetailItem label="Girls Reached" value={selectedApp.girls_reached_last_year} />
              <DetailItem label="Annual Budget" value={selectedApp.annual_budget} />
              <DetailItem label="Status" value={selectedApp.status === "submitted" ? "pending" : selectedApp.status} />
              {selectedApp.rejection_reason && (
                <DetailItem label="Rejection Reason" value={selectedApp.rejection_reason} />
              )}
              <DetailItem label="Applied" value={selectedApp.created_at ? new Date(selectedApp.created_at).toLocaleString() : null} />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
              className="rounded-xl border-[#FBB6CE]/30"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
