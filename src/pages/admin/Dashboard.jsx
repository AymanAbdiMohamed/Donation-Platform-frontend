import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";
import {
  getApplications,
  approveApplication,
  rejectApplication,
  getPlatformStats,
  deleteCharity,
} from "../../api/admin";
import { Check, X, Trash2, Eye, Search, Filter, RefreshCw, LogOut } from "lucide-react";
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

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats and all applications in parallel
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

  // Filter applications based on tab and search
  const filteredApplications = applications.filter(app => {
    const matchesTab = app.status === activeTab;
    const matchesSearch = 
      app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handlers
  const handleApprove = async (id) => {
    if (!confirm("Are you sure you want to approve this application?")) return;
    
    setActionLoading(true);
    try {
      await approveApplication(id);
      await fetchData(); // Refresh data
    } catch (err) {
      alert("Failed to approve application: " + (err.response?.data?.message || err.message));
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
      await fetchData(); // Refresh data
    } catch (err) {
      alert("Failed to reject application: " + (err.response?.data?.message || err.message));
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
        <div className="text-xl animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage charity applications and platform overview.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={fetchData} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              logout();
              navigate(ROUTES.LOGIN);
            }}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Donations" 
          value={`$${stats?.total_donations_dollars?.toFixed(2) || "0.00"}`} 
          desc="Lifetime platform volume"
        />
        <StatsCard 
          title="Pending Applications" 
          value={stats?.pending_count || 0} 
          desc="Requires review"
          highlight={stats?.pending_count > 0}
        />
        <StatsCard 
          title="Active Charities" 
          value={stats?.total_charities || 0} 
          desc="Approved organizations"
        />
        <StatsCard 
          title="Total Donors" 
          value={stats?.total_donors || 0} 
          desc="Registered donors"
        />
      </div>

      {/* Main Content Area */}
      <Card className="border-none shadow-sm">
        <CardHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Applications</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search applications..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 border-b">
              <TabsList className="bg-transparent h-12 p-0 space-x-6">
                <TabTrigger value="pending" label="Pending" count={stats?.pending_count} />
                <TabTrigger value="approved" label="Approved" count={stats?.approved_count} />
                <TabTrigger value="rejected" label="Rejected" count={stats?.rejected_count} />
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="p-0 m-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-muted-foreground bg-gray-50/50 font-medium border-b">
                    <tr>
                      <th className="px-6 py-4">Organization</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Submitted</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                          No {activeTab} applications found.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                {app.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold">{app.name}</div>
                                <div className="text-xs text-muted-foreground">{app.contact_email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground capitalize">
                            {app.category || "General"}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : "Draft"}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={
                              app.status === 'approved' ? 'success' : 
                              app.status === 'rejected' ? 'destructive' : 'secondary'
                            } className="capitalize">
                              {app.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => openDetailModal(app)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {app.status === "pending" && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => handleApprove(app.id)}
                                    title="Approve"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => openRejectModal(app)}
                                    title="Reject"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Rejection Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting <strong>{selectedApp?.name}</strong>.
              This will be sent to the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="e.g. Missing registration documents..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim() || actionLoading}
            >
              {actionLoading ? "Rejecting..." : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedApp?.name}</DialogTitle>
            <DialogDescription>Application Details</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Status" value={<Badge>{selectedApp?.status}</Badge>} />
              <DetailItem label="Category" value={selectedApp?.category} />
              <DetailItem label="Location" value={selectedApp?.location} />
              <DetailItem label="Registration #" value={selectedApp?.registration_number} />
              <DetailItem label="Website" value={selectedApp?.website} isLink />
              <DetailItem label="Contact Phone" value={selectedApp?.contact_phone} />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground text-sm bg-gray-50 p-3 rounded-md">
                  {selectedApp?.description || "No description provided."}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Mission</h4>
                <p className="text-muted-foreground text-sm bg-gray-50 p-3 rounded-md">
                  {selectedApp?.mission || "No mission statement provided."}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Goals</h4>
                <p className="text-muted-foreground text-sm bg-gray-50 p-3 rounded-md">
                  {selectedApp?.goals || "No goals listed."}
                </p>
              </div>
            </div>
            
            {selectedApp?.rejection_reason && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-md">
                <h4 className="font-semibold text-red-800 mb-1">Rejection Reason</h4>
                <p className="text-red-700 text-sm">{selectedApp.rejection_reason}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sub-components
function StatsCard({ title, value, desc, highlight }) {
  return (
    <Card className={highlight ? "border-primary/20 bg-primary/5" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function TabTrigger({ value, label, count }) {
  return (
    <TabsTrigger 
      value={value}
      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-2"
    >
      {label}
      {count !== undefined && (
        <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
          {count}
        </span>
      )}
    </TabsTrigger>
  );
}

function DetailItem({ label, value, isLink }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-1">{label}</h4>
      {isLink && value ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-medium truncate block">
          {value}
        </a>
      ) : (
        <div className="text-sm font-medium">{value || "N/A"}</div>
      )}
    </div>
  );
}
