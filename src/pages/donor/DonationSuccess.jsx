import { Link, useLocation } from "react-router-dom";
import { getDonationReceipt } from "../../api/donor";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Download, Printer, ArrowLeft } from "lucide-react";

function DonationSuccess() {
  const location = useLocation();
  const { donation, charity } = location.state || {};

  if (!donation) {
    return (
      <DashboardLayout title="Donation">
        <div className="flex items-center justify-center py-20">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-10 pb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Wait a second...</h1>
              <p className="text-muted-foreground mb-8">We couldn&apos;t find your donation details.</p>
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

  return (
    <DashboardLayout title="Donation Successful">
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-xl overflow-hidden animate-fade-in-up">
          
          {/* Success Header */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-10 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Thank You!</h1>
            <p className="text-lg opacity-90 mt-1">Your donation was successful.</p>
          </div>

          {/* Receipt Summary */}
          <CardContent className="p-8">
            <div className="bg-secondary/50 rounded-xl p-6 space-y-4 border border-border">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="font-medium text-sm">Transaction ID</span>
                <span className="text-foreground font-mono text-sm">#{donation.id || "TXN-88219"}</span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="text-muted-foreground font-medium text-sm">Charity</span>
                <span className="text-foreground font-bold">{charity?.name || "Verified Organization"}</span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="text-muted-foreground font-medium text-sm">Amount</span>
                <span className="text-emerald-600 font-extrabold text-2xl">${(donation.amount_dollars || donation.amount / 100 || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button asChild size="lg" className="w-full rounded-xl h-12 text-base shadow-lg shadow-primary/20">
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
