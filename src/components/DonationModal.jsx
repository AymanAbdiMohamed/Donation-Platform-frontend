import { useState } from "react";

/**
 * DONATION MODAL (The Popup)
 * 
 * Props:
 * - charity: The specific charity being donated to
 * - isOpen: Boolean that tells us if we should show this modal
 * - onClose: Function to close the modal
 * - onConfirm: Function to send the donation data to the server
 */
function DonationModal({ charity, isOpen, onClose, onConfirm }) {
  // 'amount' holds the text in the input box
  const [amount, setAmount] = useState("");
  // 'isSubmitting' tracks if the API call is in progress (so we can disable buttons)
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Shortcuts for the donor to quickly pick a common amount
  const quickAmounts = [10, 25, 50, 100];

  // If 'isOpen' is false, we don't render ANYTHING (the modal disappears)
  if (!isOpen) return null;

  /**
   * Logic to handle the 'Confirm' click
   */
  const handleConfirm = async () => {
    // 1. Convert the text input to a real number
    const numericAmount = parseFloat(amount);
    
    // 2. Simple validation: make sure it's a positive number
    if (!numericAmount || numericAmount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    // 3. Start the submission process
    setIsSubmitting(true);
    try {
      // Call the function passed down from the parent (BrowseCharities)
      await onConfirm(numericAmount);
    } catch (err) {
      // Error handling is handled here locally for the modal UI
      console.error("Donation failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      // Stop the 'Loading' state when finished (success or failure)
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-red-600 p-8 text-white text-center">
          <h2 className="text-2xl font-bold">Make a Donation</h2>
          <p className="opacity-90 mt-1">To: {charity?.name}</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Selection */}
          <div className="grid grid-cols-4 gap-3">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className={`py-3 rounded-xl font-bold transition-all ${
                  amount === amt.toString() 
                    ? "bg-red-600 text-white scale-105" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter custom amount"
              className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-10 rounded-2xl focus:outline-none focus:border-red-300 text-xl font-bold text-gray-900 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-[2] bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-red-100 disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Confirm Donation"}
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-gray-50 p-4 text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          Secure Payment Processing
        </div>
      </div>
    </div>
  );
}

export default DonationModal;
