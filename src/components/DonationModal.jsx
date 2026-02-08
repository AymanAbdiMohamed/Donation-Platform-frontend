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
import { Heart, Loader2 } from "lucide-react";

/**
 * Donation Modal
 *
 * Props:
 * - charity: Charity object
 * - open: Boolean to show/hide modal
 * - onClose: Function to close modal
 * - onSuccess: Callback after successful donation
 * - onConfirm?: Optional override to handle donation (parent can handle API)
 */
export function DonationModal({
  charity,
  open,
  onClose,
  onSuccess,
  onConfirm,
}) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quickAmounts = [10, 25, 50, 100];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      if (onConfirm) {
        await onConfirm(amountNum, message, isAnonymous);
      } else {
        // fallback internal API call
        const { createDonation } = await import("@/api/donor");
        await createDonation({
          charity_id: charity.id,
          amount: Math.floor(amountNum * 100), // cents
          message: message.trim() || null,
          is_anonymous: isAnonymous,
        });
      }

      if (onSuccess) onSuccess();
      onClose();

      // Reset form
      setAmount("");
      setMessage("");
      setIsAnonymous(false);
    } catch (err) {
      console.error("Donation failed:", err);
      setError(err.response?.data?.message || "Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Donate to {charity?.name}
          </DialogTitle>
          <DialogDescription>
            Your contribution helps provide essential menstrual hygiene products to girls in need.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant={amount == amt ? "default" : "outline"}
                onClick={() => setAmount(amt.toString())}
                disabled={loading}
              >
                ${amt}
              </Button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Custom Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="50.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="0.01"
              disabled={loading}
            />
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
            <Label htmlFor="anonymous" className="text-sm font-normal cursor-pointer">
              Make this donation anonymous
            </Label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Donate ${amount || "0"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
