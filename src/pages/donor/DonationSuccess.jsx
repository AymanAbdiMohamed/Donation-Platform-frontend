import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { getDonationReceipt, getDonationStatus } from "../../api/donor";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  Download,
  Printer,
  ArrowLeft,
  Loader2,
  Smartphone,
  XCircle,
  Share2,
  Heart,
  Sparkles,
} from "lucide-react";

const POLL_INTERVAL = 3000;
const MAX_POLLS = 40;

function DonationSuccess() {
  const location = useLocation();
  const { donation: initialDonation, charity, stkMessage } = location.state || {};

  const [donation, setDonation] = useState(initialDonation);
  const [status, setStatus] = useState(initialDonation?.status || "PENDING");
  const [receiptNumber, setReceiptNumber] = useState(
    initialDonation?.mpesa_receipt_number || null
  );
  const pollCount = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!donation?.id || status !== "PENDING") return;
    const poll = async () => {
      try {
        const data = await getDonationStatus(donation.id);
        setStatus(data.status);
        if (data.mpesa_receipt_number) setReceiptNumber(data.mpesa_receipt_number);
        if (data.status === "PENDING" && pollCount.current < MAX_POLLS) {
          pollCount.current += 1;
          timerRef.current = setTimeout(poll, POLL_INTERVAL);
        }
      } catch {
        // Stop polling on error
      }
    };
    timerRef.current = setTimeout(poll, POLL_INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [donation?.id, status]);

  // No donation data
  if (!donation) {
    return (
      <DashboardLayout title="Donation">
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md w-full text-center border-[#FBB6CE]/20 shadow-lg">
            <CardContent className="pt-10 pb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-6">
                <AlertCircle className="h-8 w-8 text-[#EF4444]" />
              </div>
              <h1 className="text-2xl font-bold text-[#1F2937] mb-2">
                Wait a second...
              </h1>
              <p className="text-[#4B5563] mb-8">
                We couldn&apos;t find your donation details.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink"
              >
                <Link to="/donor">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const amountDisplay = donation.amount_dollars
    ? `KES ${Number(donation.amount_dollars).toLocaleString()}`
    : donation.amount
    ? `KES ${(donation.amount / 100).toLocaleString()}`
    : "KES 0";

  // PENDING
  if (status === "PENDING") {
    return (
      <DashboardLayout title="Completing Payment">
        <div className="flex items-center justify-center py-12">
          <Card className="w-full max-w-xl overflow-hidden animate-fade-in-up border-0 shadow-pink-lg">
            {/* Amber gradient header for pending */}
            <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] p-10 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-2xl translate-x-10 -translate-y-10" />
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm animate-pulse-soft">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Check Your Phone
                </h1>
                <p className="text-lg opacity-90 mt-2">
                  {stkMessage || "An M-Pesa prompt has been sent to your phone."}
                </p>
              </div>
            </div>

            <CardContent className="p-8 text-center">
              <div className="bg-[#FDF2F8] rounded-xl p-6 space-y-4 border border-[#FBB6CE]/20 mb-6">
                <div className="flex justify-between items-center text-[#4B5563]">
                  <span className="font-medium text-sm">Charity</span>
                  <span className="text-[#1F2937] font-bold">
                    {charity?.name || "Verified Organization"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-[#FBB6CE]/20 pt-4">
                  <span className="text-[#4B5563] font-medium text-sm">Amount</span>
                  <span className="text-[#F59E0B] font-extrabold text-2xl">
                    {amountDisplay}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[#4B5563]">
                <Loader2 className="h-4 w-4 animate-spin text-[#EC4899]" />
                <span className="text-sm">Waiting for payment confirmation...</span>
              </div>

              <Button asChild variant="ghost" className="mt-6 text-[#4B5563] hover:text-[#EC4899] hover:bg-[#FDF2F8]">
                <Link to="/donor">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // FAILED
  if (status === "FAILED") {
    return (
      <DashboardLayout title="Payment Failed">
        <div className="flex items-center justify-center py-12">
          <Card className="w-full max-w-xl overflow-hidden animate-fade-in-up border-0 shadow-lg">
            <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] p-10 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-2xl translate-x-10 -translate-y-10" />
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
                  <XCircle className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Payment Failed
                </h1>
                <p className="text-lg opacity-90 mt-2">
                  The M-Pesa payment was not completed.
                </p>
              </div>
            </div>

            <CardContent className="p-8 text-center">
              <p className="text-[#4B5563] mb-6">
                This could happen if you cancelled the request or entered the wrong PIN.
                You can try again from the charities page.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-xl w-full bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink"
              >
                <Link to="/donor/browse">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try Again
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // SUCCESS
  return (
    <DashboardLayout title="Donation Successful">
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-xl overflow-hidden animate-fade-in-up border-0 shadow-pink-lg">
          {/* Celebration Header */}
          <div className="bg-gradient-to-br from-[#EC4899] via-[#DB2777] to-[#BE185D] p-10 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-3xl translate-x-10 -translate-y-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 blur-2xl -translate-x-10 translate-y-10" />
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 backdrop-blur-sm animate-count-up">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-[#FBB6CE]" />
                <span className="text-sm font-medium text-[#FBB6CE]">Donation Complete</span>
                <Sparkles className="h-4 w-4 text-[#FBB6CE]" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Thank You!
              </h1>
              <p className="text-lg text-white/80 mt-2">
                Your generosity makes a real difference.
              </p>
            </div>
          </div>

          {/* Receipt Summary */}
          <CardContent className="p-8">
            {/* Impact Message */}
            <div className="bg-[#FDF2F8] rounded-xl p-4 mb-6 border border-[#FBB6CE]/20 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-[#EC4899]" />
                <span className="text-sm font-semibold text-[#EC4899]">Your Impact</span>
              </div>
              <p className="text-sm text-[#4B5563]">
                Your donation helps provide essential menstrual hygiene products to girls in need.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 space-y-4 border border-[#FBB6CE]/10 shadow-sm">
              {receiptNumber && (
                <div className="flex justify-between items-center text-[#4B5563]">
                  <span className="font-medium text-sm">M-Pesa Receipt</span>
                  <span className="text-[#1F2937] font-mono text-sm bg-[#FDF2F8] px-2 py-0.5 rounded">
                    {receiptNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-[#4B5563]">
                <span className="font-medium text-sm">Transaction ID</span>
                <span className="text-[#1F2937] font-mono text-sm">
                  #{donation.id || "---"}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-[#FBB6CE]/10 pt-4">
                <span className="text-[#4B5563] font-medium text-sm">Charity</span>
                <span className="text-[#1F2937] font-bold">
                  {charity?.name || "Verified Organization"}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-[#FBB6CE]/10 pt-4">
                <span className="text-[#4B5563] font-medium text-sm">Amount</span>
                <span className="text-[#EC4899] font-extrabold text-2xl">
                  {amountDisplay}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <Button
                asChild
                size="lg"
                className="w-full rounded-xl h-12 text-base bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink hover:shadow-pink-lg transition-all"
              >
                <Link to="/donor">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                {donation.id && (
                  <Button
                    variant="outline"
                    className="rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8] text-[#4B5563]"
                    onClick={async () => {
                      try {
                        const data = await getDonationReceipt(donation.id);
                        const r = data.receipt;
                        const lines = [
                          "DONATION RECEIPT",
                          `Receipt Number: ${r.receipt_number}`,
                          `Date: ${r.date}`,
                          "",
                          `Amount: KES ${Number(r.amount_dollars || 0).toLocaleString()}`,
                          `Charity: ${r.charity?.name}`,
                          `Donor: ${r.is_anonymous ? "Anonymous" : r.donor?.name}`,
                          receiptNumber ? `M-Pesa Receipt: ${receiptNumber}` : "",
                          "",
                          `Generated: ${r.generated_at}`,
                        ]
                          .filter(Boolean)
                          .join("\n");
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
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Receipt
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8] text-[#4B5563]"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="text-xs text-[#9CA3AF] font-medium">Share your impact:</span>
                <button
                  onClick={() => {
                    const text = `I just donated ${amountDisplay} to ${charity?.name || "a great cause"} on SheNeeds! ????`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="w-8 h-8 rounded-lg bg-[#FDF2F8] flex items-center justify-center text-[#EC4899] hover:bg-[#FCE7F3] transition-colors"
                  title="Share on Twitter"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="text-center text-[#9CA3AF] text-xs mt-6">
              A confirmation email has been sent to your registered address.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DonationSuccess;
