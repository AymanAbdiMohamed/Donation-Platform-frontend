import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCharities } from "../../api/charity";
import { initiateMpesaDonation } from "../../api/donor";
import CharityCard from "../../components/CharityCard";
import DonationModal from "../../components/DonationModal";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Loader2, Heart, AlertCircle, Search } from "lucide-react";

/**
 * BROWSE CHARITIES PAGE
 *
 * Allows donors to explore registered charities and make M-Pesa donations.
 */
function BrowseCharities() {
  const navigate = useNavigate();

  // Data state
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Donation modal state
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const data = await getCharities();

        // Support both `{ charities: [] }` and raw array responses
        const charitiesList = Array.isArray(data)
          ? data
          : Array.isArray(data?.charities)
          ? data.charities
          : [];

        setCharities(charitiesList);
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
   * Open donation modal for a selected charity
   */
  const handleOpenModal = (charity) => {
    setSelectedCharity(charity);
    setIsModalOpen(true);
  };

  /**
   * Confirm M-Pesa donation submission.
   * Fires the STK Push, then navigates to the success/pending page.
   */
  const handleConfirmDonation = async (amount, phoneNumber, message, isAnonymous) => {
    if (!selectedCharity) return;

    const response = await initiateMpesaDonation({
      charity_id: selectedCharity.id,
      amount,
      phone_number: phoneNumber,
      message: message || "",
      is_anonymous: Boolean(isAnonymous),
    });

    setIsModalOpen(false);

    navigate("/donation/success", {
      state: {
        donation: response?.donation,
        charity: selectedCharity,
        stkMessage: response?.message,
      },
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Browse Charities">
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium">Loading amazing charities...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Browse Charities">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Search className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Explore Charities
            </h1>
            <p className="text-muted-foreground">
              Find a cause that speaks to you and make a difference today.
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-destructive font-semibold">{error}</p>
        </div>
      ) : charities.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-lg font-medium">
            No charities found. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((charity) => (
            <CharityCard
              key={charity.id}
              charity={charity}
              onDonate={handleOpenModal}
            />
          ))}
        </div>
      )}

      {/* Donation Modal */}
      <DonationModal
        charity={selectedCharity}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDonation}
      />
    </DashboardLayout>
  );
}

export default BrowseCharities;
