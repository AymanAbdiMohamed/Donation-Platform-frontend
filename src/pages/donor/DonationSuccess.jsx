import { Link, useLocation } from "react-router-dom";
import { getDonationReceipt } from "../../api/donor";
import DashboardLayout from "../../components/layout/DashboardLayout";

/**
 * DONATION SUCCESS PAGE
 * 
 * This page is shown after a successful donation. 
 * It provides a receipt-style summary and a clear way back to the dashboard.
 */
function DonationSuccess() {
  /**
   * USELOCATION
   * When we navigate to this page from BrowseCharities, we 'send' data along with the link.
   * We use useLocation() to 'catch' that data (the donation details and charity info).
   */
  const location = useLocation();
  const { donation, charity } = location.state || {}; // Extract the data we sent

  // SAFETY CHECK: If someone tries to visit this page directly without donating, 
  // we won't have any data. In that case, we show a nice error message.
  if (!donation) {
    return (
      <DashboardLayout title="Donation">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md">
          <div className="text-red-600 mb-6 font-black text-6xl">!</div>
          <h1 className="text-2xl font-bold text-gray-900">Wait a second...</h1>
          <p className="text-gray-500 mt-4">We couldn't find your donation details.</p>
          <Link to="/donor" className="mt-8 inline-block bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition">
            Go to Dashboard
          </Link>
        </div>
      </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Donation Successful">
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-700">
        
        {/* Success Header */}
        <div className="bg-green-600 p-12 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black">Thank You!</h1>
          <p className="text-xl opacity-90 mt-2">Your donation was successful.</p>
        </div>

        {/* Receipt Summary */}
        <div className="p-10">
          <div className="bg-gray-50 rounded-2xl p-8 space-y-4 border border-gray-100">
            <div className="flex justify-between items-center text-gray-500 font-medium">
              <span>Transaction ID</span>
              <span className="text-gray-900 font-mono text-sm">#{donation.id || "TXN-88219"}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <span className="text-gray-500 font-medium">Charity</span>
              <span className="text-gray-900 font-bold">{charity?.name || "Verified Organization"}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <span className="text-gray-500 font-medium">Amount</span>
              <span className="text-green-600 font-black text-2xl">${(donation.amount_dollars || donation.amount / 100 || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {/* Action Buttons */}
            <Link 
              to="/donor" 
              className="block w-full bg-red-600 text-white text-center py-5 rounded-2xl font-bold text-xl hover:bg-black transition-all shadow-xl shadow-red-100"
            >
              Back to Dashboard
            </Link>
            
            {donation.id && (
              <button
                onClick={async () => {
                  try {
                    const data = await getDonationReceipt(donation.id);
                    const r = data.receipt;
                    const lines = [
                      "DONATION RECEIPT",
                      `Receipt Number: ${r.receipt_number}`,
                      `Date: ${r.date}`,
                      "",
                      `Amount: $${(r.amount_dollars || 0).toFixed(2)}`,
                      `Charity: ${r.charity?.name}`,
                      `Donor: ${r.is_anonymous ? "Anonymous" : r.donor?.name}`,
                      "",
                      `Generated: ${r.generated_at}`,
                    ].join("\n");
                    const blob = new Blob([lines], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${r.receipt_number}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch {
                    alert("Could not download receipt.");
                  }
                }}
                className="block w-full text-red-600 font-bold py-3 hover:text-red-800 transition"
              >
                Download Receipt
              </button>
            )}

            <button 
              onClick={() => window.print()}
              className="block w-full text-gray-400 font-bold py-3 hover:text-gray-600 transition"
            >
              Print Receipt
            </button>
          </div>

          <p className="text-center text-gray-400 text-xs mt-8">
            A confirmation email has been sent to your registered address.
          </p>
        </div>

      </div>
    </div>
    </DashboardLayout>
  );
}

export default DonationSuccess;
