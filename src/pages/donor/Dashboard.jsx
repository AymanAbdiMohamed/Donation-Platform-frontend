/**
 * Donor Dashboard
 * Main dashboard for donors to view their activity and make donations
 * 
 * NOTE: This is currently a placeholder. Core functionality to be implemented.
 */
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";

function DonorDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Donor Dashboard">
      <div className="max-w-4xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {user?.email || "Donor"}!
          </h2>
          <p className="text-gray-600">
            Thank you for being part of the SheNeeds community.
          </p>
        </div>

        {/* Quick Stats - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Donated" value="$0.00" />
          <StatCard title="Charities Supported" value="0" />
          <StatCard title="Last Donation" value="--" />
        </div>

        {/* Placeholder Sections */}
        <div className="space-y-6">
          {/* TODO: FE1 - Implement donation history list */}
          <PlaceholderSection 
            title="Donation History"
            description="Your recent donations will appear here."
          />

          {/* TODO: FE1 - Implement favorite charities feature */}
          <PlaceholderSection 
            title="Favorite Charities"
            description="Save and track your favorite charities."
          />

          {/* TODO: FE1 - Implement recurring donations management */}
          <PlaceholderSection 
            title="Recurring Donations"
            description="Manage your recurring donation subscriptions."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

/**
 * Stat Card Component
 * TODO: FE1 - Connect to actual donation data from backend
 */
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

/**
 * Placeholder Section Component
 * Used for sections that are not yet implemented
 */
function PlaceholderSection({ title, description }) {
  return (
    <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
      <p className="text-xs text-gray-400 mt-4">Coming soon</p>
    </div>
  );
}

export default DonorDashboard;
