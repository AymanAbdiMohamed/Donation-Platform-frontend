import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCharities } from "../../api";
import { createDonation } from "../../api/donor";
import CharityCard from "../../components/CharityCard";
import DonationModal from "../../components/DonationModal";
import DashboardLayout from "../../components/layout/DashboardLayout";

/**
 * BROWSE CHARITIES PAGE
 * 
 * This page allows donors to explore registered charities and make donations.
 */
function BrowseCharities() {
  const navigate = useNavigate();
  // State for the list of charities we get from the backend
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true); // Is the list still loading?
  const [error, setError] = useState(null); // Did the API call fail?

  /**
   * State for the 'Donation Modal'
   * We need to track WHICH charity the user clicked on, and IF the modal is open.
   */
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch charities when the user enters this page
  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const data = await getCharities();
        setCharities(data.charities || []);
      } catch (err) {
        console.error("Failed to fetch charities:", err);
        setError("Could not load charities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  /**
   * Action: Open the donation popup
   * @param {Object} charity - The charity object the user wants to donate to
   */
  const handleOpenModal = (charity) => {
    setSelectedCharity(charity); // Remember which charity was picked
    setIsModalOpen(true);        // Show the modal
  };

  /**
   * Action: Finalize the donation
   * This is called by the Modal when the user clicks 'Confirm'
   * @param {Number} amount - The dollar amount chosen
   */
  const handleConfirmDonation = async (amount, message, isAnonymous) => {
    try {
      const response = await createDonation({
        charity_id: selectedCharity.id,
        amount: Math.floor(amount * 100),
        message: message || "",
        is_anonymous: isAnonymous || false,
      });

      navigate("/donation/success", { 
        state: { 
          donation: response.donation, 
          charity: selectedCharity 
        } 
      });
    } catch (err) {
      console.error("Donation submission failed:", err);
      throw err; 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-bold text-gray-400 animate-pulse">Loading amazing charities...</div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Browse Charities">
    <div className="min-h-screen bg-gray-50 p-8 md:p-12">
      <header className="max-w-7xl mx-auto mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Explore Charities</h1>
          <p className="text-gray-500 mt-2 text-lg">Find a cause that speaks to you and make a difference today.</p>
        </div>
      </header>

      {error ? (
        <div className="max-w-md mx-auto bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold">
          {error}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charities.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 text-xl font-medium">No charities found. Check back later!</p>
            </div>
          ) : (
            charities.map((charity) => (
              <CharityCard 
                key={charity.id} 
                charity={charity} 
                onDonate={handleOpenModal} 
              />
            ))
          )}
        </div>
      )}

      {/* Donation Modal */}
      <DonationModal 
        charity={selectedCharity}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDonation}
      />
    </div>
    </DashboardLayout>
  );
}

export default BrowseCharities;
