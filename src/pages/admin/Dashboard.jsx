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
import { Check, X, Eye, Search, RefreshCw, LogOut } from "lucide-react";
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

  const filteredApplications = applications.filter(app => {
    const matchesTab = app.status === activeTab;
    const matchesSearch = 
      app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase());
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
        <StatsCard title="Total Donations" value={`$${stats?.total_donations_dollars?.toFixed(2) || "0.00"}`} desc="Lifetime platform volume" />
        <StatsCard title="Pending Applications" value={stats?.pending_count || 0} desc="Requires review" highlight={stats?.pending_count > 0} />
        <StatsCard title="Active Charities" value={stats?.total_charities || 0} desc="Approved organizations" />
        <StatsCard title="Total Donors" value={stats?.total_donors || 0} desc="Registered donors" />
      </div>

      {/* Applications Table & Modals */}
      {/* Keep your existing table, Tabs, and modals here... */}
    </div>
  );
}

// Sub-components: StatsCard, TabTrigger, DetailItem (keep as in your xervi/dev version)
