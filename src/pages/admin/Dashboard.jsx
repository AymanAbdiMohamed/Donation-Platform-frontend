/**
 * Admin Dashboard
 * Allows admins to review and approve/reject charity applications
 */
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPendingApplications, approveApplication, rejectApplication } from "../../api";
import DashboardLayout from "../../components/layout/DashboardLayout";

function AdminDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    fetchPendingApplications();
  }, [fetchPendingApplications]);

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
      <div className="max-w-4xl mx-auto p-6">
        {/* User Info */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600">
            Logged in as: <span className="font-medium">{user?.email}</span>
          </p>
          <p className="text-gray-600">
            Role: <span className="font-medium capitalize">{user?.role}</span>
          </p>
        </div>

        {/* Pending Applications Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Pending Charity Applications
          </h2>

          {/* Loading State */}
          {loading && (
            <p className="text-gray-500">Loading applications...</p>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
              {error}
              <button
                onClick={fetchPendingApplications}
                className="ml-4 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && applications.length === 0 && (
            <div className="bg-gray-50 text-gray-500 p-8 rounded-lg text-center">
              <p>No pending applications at this time.</p>
            </div>
          )}

          {/* Applications List */}
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
        </section>

        {/* TODO: FE2 - Add admin statistics dashboard (total approved, rejected, pending counts) */}
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
    <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{displayName}</h3>
        <span className="text-xs text-gray-400">ID: {id}</span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-600">
          <span className="font-medium">Email:</span> {email || "N/A"}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Description:</span> {displayDescription}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onApprove(id)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
