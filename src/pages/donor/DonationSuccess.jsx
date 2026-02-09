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
} from "lucide-react";

const POLL_INTERVAL = 3000; // 3 seconds
const MAX_POLLS = 40; // ~2 minutes

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

  // Poll for status updates when donation is PENDING
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

  // ── No donation data at all ──────────────────────────────────────────
  if (!donation) {
    return (
      <DashboardLayout title="Donation">
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-10 pb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Wait a second...
              </h1>
              <p className="text-muted-foreground mb-8">
                We couldn&apos;t find your donation details.
              </p>
              <Button asChild size="lg" className="rounded-xl">
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

  // Amount in KES — the backend stores amount in cents (amount_dollars = cents/100  = KES)
  // So amount_dollars IS the KES value directly.
  const amountDisplay = donation.amount_dollars
    ? `KES ${Number(donation.amount_dollars).toLocaleString()}`
    : donation.amount
    ? `KES ${(donation.amount / 100).toLocaleString()}`
    : "KES 0";

  // ── PENDING — waiting for STK push completion ────────────────────────
  if (status === "PENDING") {
    return (
      <DashboardLayout title="Completing Payment">
        <div className="flex items-center justify-center py-12">
          <Card className="w-full max-w-xl overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-10 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
                <Smartphone className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Check Your Phone
              </h1>
              <p className="text-lg opacity-90 mt-1">
                {stkMessage || "An M-Pesa prompt has been sent to your phone."}
              </p>
            </div>

            <CardContent className="p-8 text-center">
              <div className="bg-secondary/50 rounded-xl p-6 space-y-4 border border-border mb-6">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="font-medium text-sm">Charity</span>
                  <span className="text-foreground font-bold">
                    {charity?.name || "Verified Organization"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-4">
                  <span className="text-muted-foreground font-medium text-sm">
                    Amount
                  </span>
                  <span className="text-amber-600 font-extrabold text-2xl">
                    {amountDisplay}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Waiting for payment confirmation...</span>
              </div>

              <Button
                asChild
                variant="ghost"
                className="mt-6"
              >
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

  // ── FAILED ───────────────────────────────────────────────────────────
  if (status === "FAILED") {
    return (
      <DashboardLayout title="Payment Failed">
        <div className="flex items-center justify-center py-12">
          <Card className="w-full max-w-xl overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-br from-destructive to-red-600 p-10 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
                <XCircle className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Payment Failed
              </h1>
              <p className="text-lg opacity-90 mt-1">
                The M-Pesa payment was not completed.
              </p>
            </div>

            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-6">
                This could happen if you cancelled the request or entered the
                wrong PIN. You can try again from the charities page.
              </p>
              <Button asChild size="lg" className="rounded-xl w-full">
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

  // ── SUCCESS ──────────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Donation Successful">
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-xl overflow-hidden animate-fade-in-up">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-10 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Thank You!
            </h1>
            <p className="text-lg opacity-90 mt-1">
              Your donation was successful.
            </p>
          </div>

          {/* Receipt Summary */}
          <CardContent className="p-8">
            <div className="bg-secondary/50 rounded-xl p-6 space-y-4 border border-border">
              {receiptNumber && (
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="font-medium text-sm">M-Pesa Receipt</span>
                  <span className="text-foreground font-mono text-sm">
                    {receiptNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="font-medium text-sm">Transaction ID</span>
                <span className="text-foreground font-mono text-sm">
                  #{donation.id || "---"}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="text-muted-foreground font-medium text-sm">
                  Charity
                </span>
                <span className="text-foreground font-bold">
                  {charity?.name || "Verified Organization"}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="text-muted-foreground font-medium text-sm">
                  Amount
                </span>
                <span className="text-emerald-600 font-extrabold text-2xl">
                  {amountDisplay}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button
                asChild
                size="lg"
                className="w-full rounded-xl h-12 text-base shadow-lg shadow-primary/20"
              >
                <Link to="/donor">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>

              {donation.id && (
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
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
                        receiptNumber
                          ? `M-Pesa Receipt: ${receiptNumber}`
                          : "",
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
                  Download Receipt
                </Button>
              )}

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
            </div>

            <p className="text-center text-muted-foreground text-xs mt-6">
              A confirmation email has been sent to your registered address.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DonationSuccess;
