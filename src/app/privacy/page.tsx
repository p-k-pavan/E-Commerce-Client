import LegalWrapper, { LegalSection } from "@/components/legal/LegalPageWrapper";

export default function PrivacyPage() {
  return (
    <LegalWrapper title="Privacy Policy" lastUpdated="Apirl 206">
      <LegalSection title="1. Information We Collect">
        <p>Namma Mart collects personal information that you provide to us, such as your name, shipping address, email, and phone number when you place an order.</p>
      </LegalSection>

      <LegalSection title="2. How We Use Your Data">
        <p>We use your information to process transactions, provide customer support, and send periodic emails regarding your order or other products and services.</p>
      </LegalSection>

      <LegalSection title="3. Data Security">
        <p>We implement a variety of security measures to maintain the safety of your personal information. Your sensitive credit information is transmitted via Secure Socket Layer (SSL) technology and processed through secure gateways like Razorpay.</p>
      </LegalSection>
    </LegalWrapper>
  );
}