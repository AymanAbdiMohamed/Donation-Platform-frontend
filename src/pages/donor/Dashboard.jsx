import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";
import { 
  getDonorStats, 
  getDonationHistory, 
  getFavoriteCharities,
  getRecurringDonations
} from "../../api/donor";

/**
 * DONOR DASHBOARD
 * 
 * This is the main page for donors. It displays their giving impact,
 * recent donation history, and favorite charities.
 * 
 * We use 'useState' to manage data and 'useEffect' to fetch it when the page loads.
 */
const ROLES_TEXT = { donor: 'Donor', charity: 'Charity', admin: 'Admin' };

function DonorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  /**
   * REACT STATE (Think of this as the component's memory)
   * We use 'useState' to store data that might change over time.
   * When we update these state variables, React automatically re-renders the page.
   */
  const [stats, setStats] = useState({ total_donated: 0, donation_count: 0, active_recurring: 0 }); // Stores summary numbers
  const [history, setHistory] = useState([]); // Stores the list of previous donations
  const [favorites, setFavorites] = useState([]); // Stores the list of favorite charities
  const [recurring, setRecurring] = useState([]); // Stores the list of active regular donations
  
  // These help us handle the 'Loading' and 'Error' states of the UI
  const [loading, setLoading] = useState(true); // Is the data still being fetched?
  const [error, setError] = useState(null); // Did something go wrong during the fetch?

  /**
   * USEEFFECT (The 'Actions' Hook)
   * This function runs automatically. By leaving the array at the end [user] 
   * empty or with 'user', we tell React to run this when the page first loads.
   */
  useEffect(() => {
    // We define an 'async' function so we can use 'await' for our API calls
    const fetchDashboardData = async () => {
      setLoading(true); // 1. Start by showing the loading spinner/text
      setError(null);   // 2. Clear any previous errors
      
      try {
        /**
         * PROMISE.ALL
         * Instead of waiting for one API call to finish before starting the next,
         * we start ALL of them at the same time. This makes the page load much faster!
         */
        const [statsData, historyData, favoritesData, recurringData] = await Promise.all([
          getDonorStats(),
          getDonationHistory(),
          getFavoriteCharities(),
          getRecurringDonations()
        ]);

        // 3. Save the fetched data into our 'memory' (State)
        setStats(statsData);
        setHistory(historyData.donations || []);
        setFavorites(favoritesData.favorites || []);
        setRecurring(recurringData.recurring || []);
      } catch (err) {
        // 4. If any call fails, we catch the error here
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        // 5. No matter what, stop the loading animation at the end
        setLoading(false);
      }
    };

    // Only fetch data if we have a logged-in user
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // If we are still loading, show a simple loading message
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  // If there was an error, show it clearly
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
    <div className="max-w-7xl mx-auto p-6 md:p-12 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="mb-10 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome back, <span className="text-red-600">{user?.email?.split('@')[0]}</span>!
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Here's the impact you've made so far.
          </p>
        </div>
        <button 
          onClick={() => {
            logout();
            navigate(ROUTES.LOGIN);
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition font-bold bg-white px-6 py-2 rounded-full border border-gray-100 shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </header>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Donated Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Total Donated</span>
          <span className="text-4xl font-black text-gray-900 mt-2">
            ${(stats.total_donated || 0).toFixed(2)}
          </span>
        </div>

        {/* Donation Count Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Donations Made</span>
          <span className="text-4xl font-black text-gray-900 mt-2">{stats.donation_count || 0}</span>
        </div>

        {/* Active Recurring Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 font-medium uppercase tracking-wider text-sm">Active Recurring</span>
          <span className="text-4xl font-black text-red-600 mt-2">{stats.active_recurring || 0}</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* RECENT DONATIONS (Left side) */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Donations</h2>
          
          {history.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">You haven't made any donations yet.</p>
              <Link to="/browse-charities" className="mt-4 inline-block text-red-600 font-bold hover:underline">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.slice(0, 5).map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">{donation.charity_name}</td>
                      <td className="px-6 py-4 text-gray-600 font-bold text-red-600">${(donation.amount || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm text-center">
                        {donation.created_at ? new Date(donation.created_at).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* RECURRING DONATIONS SECTION */}
          <h2 className="text-2xl font-bold text-gray-800 pt-6">Recurring Donations</h2>
          {recurring.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No active recurring donations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {recurring.map(item => (
                 <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                   <div>
                     <p className="font-bold text-gray-900">{item.charity_name}</p>
                     <p className="text-sm text-gray-500">Every {item.frequency || 'month'}</p>
                   </div>
                   <p className="text-xl font-black text-red-600">${(item.amount || 0).toFixed(2)}</p>
                 </div>
               ))}
            </div>
          )}
        </section>

        {/* FAVORITE CHARITIES (Right side, takes 1/3 space) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Favorites</h2>
          
          {favorites.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500">Keep track of charities you care about.</p>
              <Link to="/browse-charities" className="mt-2 inline-block text-sm text-red-600 font-bold hover:underline">
                Browse now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((charity) => (
                <div key={charity.id} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">{charity.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{charity.category || "Health & Support"}</p>
                  </div>
                  <button className="bg-red-50 text-red-600 p-2 rounded-full hover:bg-red-100 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default DonorDashboard;