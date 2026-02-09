import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDonorDashboard, getDonationReceipt } from "../../api/donor";
import DashboardLayout from "../../components/layout/DashboardLayout";

/**
 * DONOR DASHBOARD
 *
 * Displays giving impact and recent donation history.
 * Uses GET /donor/dashboard which returns { stats, recent_donations }.
 */
function DonorDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total_donated_dollars: 0,
    donation_count: 0,
    charities_supported: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getDonorDashboard();
        setStats(data.stats || {});
        setRecentDonations(data.recent_donations || []);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  const handleDownloadReceipt = async (donationId) => {
    try {
      const data = await getDonationReceipt(donationId);
      const receipt = data.receipt;

      // Build a plain-text receipt and trigger download
      const lines = [
        `DONATION RECEIPT`,
        `Receipt Number: ${receipt.receipt_number}`,
        `Date: ${receipt.date}`,
        ``,
        `Amount: $${(receipt.amount_dollars || 0).toFixed(2)}`,
        `Charity: ${receipt.charity?.name}`,
        `Donor: ${receipt.is_anonymous ? "Anonymous" : receipt.donor?.name}`,
        ``,
        `Anonymous: ${receipt.is_anonymous ? "Yes" : "No"}`,
        `Recurring: ${receipt.is_recurring ? "Yes" : "No"}`,
        receipt.message ? `Message: ${receipt.message}` : "",
        ``,
        `Charity Email: ${receipt.charity?.contact_email || "N/A"}`,
        `Charity Address: ${receipt.charity?.address || "N/A"}`,
        ``,
        `Generated: ${receipt.generated_at}`,
      ]
        .filter(Boolean)
        .join("\n");

      const blob = new Blob([lines], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${receipt.receipt_number}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download receipt:", err);
      alert("Could not download receipt. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout title="Donor Dashboard">
    <div className="max-w-7xl mx-auto p-6 md:p-12 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome back,{" "}
          <span className="text-red-600">
            {user?.username || user?.email?.split("@")[0]}
          </span>
          !
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Here&rsquo;s the impact you&rsquo;ve made so far.
        </p>
      </header>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">
            Total Donated
          </span>
          <span className="text-4xl font-black text-gray-900 mt-2">
            ${(stats.total_donated_dollars || 0).toFixed(2)}
          </span>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">
            Donations Made
          </span>
          <span className="text-4xl font-black text-gray-900 mt-2">
            {stats.donation_count || 0}
          </span>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">
            Charities Supported
          </span>
          <span className="text-4xl font-black text-red-600 mt-2">
            {stats.charities_supported || 0}
          </span>
        </div>
      </section>

      {/* Recent Donations + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Recent Donations
          </h2>

          {recentDonations.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">
                You haven&rsquo;t made any donations yet.
              </p>
              <Link
                to="/browse-charities"
                className="mt-4 inline-block text-red-600 font-bold hover:underline"
              >
                Explore Charities &rarr;
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-6 py-4">Charity</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-center">Date</th>
                    <th className="px-6 py-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentDonations.map((donation) => (
                    <tr
                      key={donation.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {donation.charity_name ||
                          `Charity #${donation.charity_id}`}
                      </td>
                      <td className="px-6 py-4 font-bold text-red-600">
                        ${(donation.amount_dollars || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm text-center">
                        {donation.created_at
                          ? new Date(
                              donation.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDownloadReceipt(donation.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm hover:underline transition"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/browse-charities"
              className="block bg-red-600 text-white text-center py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition shadow-lg"
            >
              Browse Charities
            </Link>
            <Link
              to="/charities"
              className="block bg-white text-gray-700 text-center py-4 rounded-2xl font-bold text-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              View All Charities
            </Link>
          </div>
        </section>
      </div>
    </div>
    </DashboardLayout>
  );
}

export default DonorDashboard;