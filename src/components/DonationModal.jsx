import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Loader2, Phone, Smartphone, Sparkles } from "lucide-react";

/**
 * Donation Modal ??? M-Pesa STK Push flow.
 * Pink-themed with clear amount selection and smooth transitions.
 */
export default function DonationModal({ charity, open, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("STK_PUSH"); // STK_PUSH or MANUAL
  const [paymentStep, setPaymentStep] = useState("form"); // form, instructions, success
  const [transactionCode, setTransactionCode] = useState("");
  const [initiatedDonation, setInitiatedDonation] = useState(null);
  const [manualDetails, setManualDetails] = useState(null);

  const quickAmounts = [100, 250, 500, 1000];

  const normalisePhone = (raw) => {
    let cleaned = raw.replace(/[\s\-()]/g, "");
    if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);
    if (cleaned.startsWith("0")) cleaned = "254" + cleaned.slice(1);
    return cleaned;
  };

  const isValidPhone = (raw) => /^254\d{9}$/.test(normalisePhone(raw));

  const resetForm = () => {
    setAmount("");
    setPhoneNumber("");
    setMessage("");
    setIsAnonymous(false);
    setError("");
    setPaymentMethod("STK_PUSH");
    setPaymentStep("form");
    setTransactionCode("");
    setInitiatedDonation(null);
    setManualDetails(null);
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amountNum = parseInt(amount, 10);
    if (!amountNum || amountNum < 1) {
      setError("Please enter a valid amount (minimum KES 1)");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Please enter your M-Pesa phone number");
      return;
    }
    if (!isValidPhone(phoneNumber)) {
      setError("Invalid phone number. Use format 07XXXXXXXX or 254XXXXXXXXX");
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === "STK_PUSH") {
        await onConfirm(amountNum, normalisePhone(phoneNumber), message, isAnonymous);
        // onConfirm handles the redirect/success for STK push
      } else {
        // Handle manual donation initiation
        const { createManualDonation } = await import("@/api/donor");
        const result = await createManualDonation({
          charity_id: charity.id,
          amount: amountNum,
          phone_number: normalisePhone(phoneNumber),
          message,
          is_anonymous: isAnonymous,
        });
        setInitiatedDonation(result.donation);
        setManualDetails({
          paybill: result.paybill_number,
          account: result.account_name,
          reference: result.reference,
        });
        setPaymentStep("instructions");
      }
    } catch (err) {
      console.error("Donation failed:", err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.userMessage ||
        "Donation failed. Please try again.";
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (!transactionCode.trim()) {
      setError("Please enter the transaction code from your M-Pesa SMS");
      return;
    }

    setLoading(true);
    try {
      const { submitTransactionCode } = await import("@/api/donor");
      await submitTransactionCode(initiatedDonation.id, transactionCode);
      setPaymentStep("success");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-[#FBB6CE]/20 shadow-pink-lg">
        <DialogHeader>
          {/* Pink accent header bar */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4899] to-[#DB2777] flex items-center justify-center shadow-pink">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-[#1F2937]">
                Donate to {charity?.name}
              </DialogTitle>
              <DialogDescription className="text-[#4B5563]">
                Payment via M-Pesa. Every shilling counts.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {paymentStep === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            {/* Payment Method Toggle */}
            <div className="flex p-1 bg-[#FDF2F8] rounded-xl border border-[#FBB6CE]/20">
              <button
                type="button"
                onClick={() => setPaymentMethod("STK_PUSH")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${paymentMethod === "STK_PUSH"
                  ? "bg-white text-[#EC4899] shadow-pink-sm"
                  : "text-[#4B5563] hover:text-[#EC4899]"
                  }`}
              >
                <Smartphone className="h-4 w-4" />
                M-Pesa Express
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("MANUAL")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${paymentMethod === "MANUAL"
                  ? "bg-white text-[#EC4899] shadow-pink-sm"
                  : "text-[#4B5563] hover:text-[#EC4899]"
                  }`}
              >
                <Smartphone className="h-4 w-4" />
                Manual Pay
              </button>
            </div>

            {/* Quick Amounts */}
            <div>
              <Label className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2 block">
                Quick Select
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    disabled={loading}
                    className={`relative py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200 ${amount == amt
                      ? "bg-[#EC4899] text-white shadow-pink scale-[1.02]"
                      : "bg-[#FDF2F8] text-[#1F2937] hover:bg-[#FCE7F3] hover:scale-[1.02] border border-[#FBB6CE]/20"
                      }`}
                  >
                    KES {amt}
                    {amount == amt && (
                      <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-[#FBB6CE]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-[#1F2937] font-medium">
                Amount (KES)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                step="1"
                disabled={loading}
                className="h-11 border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5 text-[#1F2937] font-medium">
                <Phone className="h-3.5 w-3.5 text-[#EC4899]" />
                M-Pesa Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={loading}
                className="h-11 border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl"
              />
              <p className="text-xs text-[#9CA3AF]">
                {paymentMethod === "STK_PUSH"
                  ? "You'll receive an STK push on this number to confirm payment."
                  : "The number you'll use to make the manual payment."}
              </p>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-[#1F2937] font-medium">
                Message <span className="text-[#9CA3AF] font-normal">(optional)</span>
              </Label>
              <Input
                id="message"
                placeholder="A word of encouragement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                className="border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl"
              />
            </div>

            {/* Anonymous */}
            <div className="flex items-center space-x-2 bg-[#FDF2F8] rounded-xl px-3 py-2.5">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                disabled={loading}
                className="border-[#FBB6CE] data-[state=checked]:bg-[#EC4899] data-[state=checked]:border-[#EC4899]"
              />
              <Label htmlFor="anonymous" className="text-sm font-normal cursor-pointer text-[#4B5563]">
                Make this donation anonymous
              </Label>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-[#EF4444] p-3 rounded-xl text-sm border border-red-100 animate-slide-up">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8] text-[#4B5563]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink hover:shadow-pink-lg transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {paymentMethod === "STK_PUSH" ? <Smartphone className="mr-2 h-4 w-4" /> : <Heart className="mr-2 h-4 w-4" />}
                    {paymentMethod === "STK_PUSH" ? "Pay Now" : "Donate Now"}
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : paymentStep === "instructions" ? (
          <div className="space-y-6 mt-4">
            <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center">
              <h3 className="font-bold text-green-800 mb-1">Donation Initiated!</h3>
              <p className="text-sm text-green-700">Please complete the payment manually following the steps below.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#FDF2F8] p-5 rounded-2xl border border-[#FBB6CE]/30 shadow-sm">
                <h4 className="text-xs font-bold text-[#EC4899] uppercase tracking-widest mb-4">Payment Steps</h4>
                <ol className="space-y-3 text-sm text-[#4B5563]">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-[#FBB6CE] flex items-center justify-center font-bold text-[#EC4899]">1</span>
                    <span>Go to M-Pesa {'>'} Lipa na M-Pesa {'>'} <b>Paybill</b></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-[#FBB6CE] flex items-center justify-center font-bold text-[#EC4899]">2</span>
                    <div>Enter Business Number: <b className="text-[#1F2937] text-lg ml-1">{manualDetails?.paybill}</b></div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-[#FBB6CE] flex items-center justify-center font-bold text-[#EC4899]">3</span>
                    <div>Account Number: <b className="text-[#1F2937] text-lg ml-1 font-mono tracking-wider">{manualDetails?.reference}</b></div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-[#FBB6CE] flex items-center justify-center font-bold text-[#EC4899]">4</span>
                    <div>Enter Amount: <b className="text-[#1F2937] text-lg ml-1">KES {amount}</b></div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-[#FBB6CE] flex items-center justify-center font-bold text-[#EC4899]">5</span>
                    <span>Enter M-Pesa PIN and Confirm</span>
                  </li>
                </ol>
              </div>

              <form onSubmit={handleSubmitCode} className="space-y-3">
                <Label htmlFor="code" className="text-sm font-semibold text-[#1F2937]">M-Pesa Transaction Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    placeholder="e.g. QJD4K8L2MN"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    required
                    className="flex-1 h-11 border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl font-mono uppercase tracking-widest"
                  />
                  <Button
                    type="submit"
                    disabled={loading || !transactionCode}
                    className="h-11 px-6 bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-xl shadow-pink"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                  </Button>
                </div>
                <p className="text-xs text-[#9CA3AF] italic text-center">Enter the code from the M-Pesa SMS to verify your donation.</p>
              </form>
            </div>

            {error && (
              <div className="bg-red-50 text-[#EF4444] p-3 rounded-xl text-sm border border-red-100 italic">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Sparkles className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#1F2937]">Thank You!</h3>
            <p className="text-[#4B5563]">Your donation code has been submitted for verification. We&apos;ll notify you once it&apos;s processed!</p>
            <Button
              onClick={handleClose}
              className="mt-6 px-8 bg-[#EC4899] hover:bg-[#DB2777] text-white rounded-xl shadow-pink"
            >
              Back to Charities
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
