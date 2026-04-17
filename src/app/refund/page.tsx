import LegalWrapper, { LegalSection } from "@/components/legal/LegalPageWrapper";
import { RefreshCcw, Truck, CheckCircle } from "lucide-react";

export default function RefundPage() {
  return (
    <LegalWrapper title="Refund Policy" lastUpdated="Apirl 206">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-green-50 text-center">
          <RefreshCcw className="w-6 h-6 text-(--color-primary) mx-auto mb-2" />
          <h3 className="font-bold text-(--color-text)">7 Days</h3>
          <p className="text-xs">Return Window</p>
        </div>
        <div className="p-6 rounded-2xl bg-green-50 text-center">
          <Truck className="w-6 h-6 text-(--color-primary) mx-auto mb-2" />
          <h3 className="font-bold text-(--color-text)">Free Pickup</h3>
          <p className="text-xs">On valid returns</p>
        </div>
        <div className="p-6 rounded-2xl bg-green-50 text-center">
          <CheckCircle className="w-6 h-6 text-(--color-primary) mx-auto mb-2" />
          <h3 className="font-bold text-(--color-text)">Easy Refund</h3>
          <p className="text-xs">To original source</p>
        </div>
      </div>

      <LegalSection title="1. Eligibility for Returns">
        <p>Your item must be unused and in the same condition that you received it. It must also be in the original packaging. Perishable items (like fresh produce) can only be returned at the time of delivery.</p>
      </LegalSection>

      <LegalSection title="2. Refund Process">
        <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to your original method of payment within 5-7 working days.</p>
      </LegalSection>
    </LegalWrapper>
  );
}