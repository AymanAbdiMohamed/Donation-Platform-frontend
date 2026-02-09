import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCharities } from "../api";
import { createDonation } from "../api/donor";
import CharityCard from "../components/CharityCard";
import { DonationModal } from "../components/DonationModal";

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
        setCharities(data || []);
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
   * @param {String} message - Optional message from the donor
   * @param {Boolean} isAnonymous - Whether the donation is anonymous
   */
  const handleConfirmDonation = async (amount, message, isAnonymous) => {
    try {
      // 1. Tell the server to create a new donation record
      // We send the charity ID, amount in cents, message, and anonymous flag
      const response = await createDonation({
        charity_id: selectedCharity.id,
        amount: Math.round(amount * 100), // Convert dollars to cents with proper rounding
        message: message?.trim() || undefined,
        is_anonymous: isAnonymous,
        payment_method: "credit_card" // In a real app, this would come from a payment provider like Stripe
      });

      // 2. If the API call worked, take the user to the Success Page
      // We pass the new donation details so the success page can show a receipt
      navigate("/donation/success", { 
        state: { 
          donation: response.donation, 
          charity: selectedCharity 
        } 
      });
    } catch (err) {
      console.error("Donation submission failed:", err);
      // We throw the error so the Modal knows to stop its 'Submitting' state
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
    <div className="min-h-screen bg-gray-50 p-8 md:p-12">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Explore Charities</h1>
          <p className="text-gray-500 mt-2 text-lg">Find a cause that speaks to you and make a difference today.</p>
        </div>
        <button 
          onClick={() => navigate("/donor")}
          className="bg-white text-gray-600 font-bold px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
        >
          Back to Dashboard
        </button>
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
  );
}

export default BrowseCharities;
