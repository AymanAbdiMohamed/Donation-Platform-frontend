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
import { Heart, Loader2, Phone, Smartphone } from "lucide-react";

/**
 * Donation Modal — M-Pesa STK Push flow.
 *
 * Props:
 * - charity: Charity object
 * - open: Boolean to show/hide modal
 * - onClose: Function to close modal
 * - onConfirm: (amount, phoneNumber, message, isAnonymous) => Promise
 */
export default function DonationModal({
  charity,
  open,
  onClose,
  onConfirm,
}) {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // KES quick amounts relevant for Kenyan donations
  const quickAmounts = [100, 250, 500, 1000];

  /**
   * Normalise a Kenyan phone number to 254XXXXXXXXX.
   * Accepts: 0712345678, +254712345678, 254712345678
   */
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
      await onConfirm(amountNum, normalisePhone(phoneNumber), message, isAnonymous);
      resetForm();
    } catch (err) {
      console.error("Donation failed:", err);
      // Backend returns { error: "...", message: "..." } on failure
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <Heart className="h-4 w-4 text-primary" />
            </div>
            Donate to {charity?.name}
          </DialogTitle>
          <DialogDescription>
            Your contribution helps provide essential menstrual hygiene products
            to girls in need. Payment via M-Pesa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Amounts (KES) */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant={amount == amt ? "default" : "outline"}
                className={amount == amt ? "shadow-md shadow-primary/20" : ""}
                onClick={() => setAmount(amt.toString())}
                disabled={loading}
              >
                KES {amt}
              </Button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="1"
              disabled={loading}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
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
            />
            <p className="text-xs text-muted-foreground">
              You&apos;ll receive an STK push on this number to confirm payment.
            </p>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Input
              id="message"
              placeholder="Optional message to the charity"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Anonymous */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
              disabled={loading}
            />
            <Label
              htmlFor="anonymous"
              className="text-sm font-normal cursor-pointer"
            >
              Make this donation anonymous
            </Label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-xl text-sm border border-destructive/20">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending STK Push...
                </>
              ) : (
                <>
                  <Smartphone className="mr-2 h-4 w-4" />
                  Pay KES {amount || "0"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
