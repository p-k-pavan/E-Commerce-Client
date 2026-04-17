import LegalWrapper, { LegalSection } from "@/components/legal/LegalPageWrapper";


export default function TermsPage() {
  return (
    <LegalWrapper title="Terms & Conditions" lastUpdated="Apirl 206">
      <LegalSection title="1. Acceptance of Terms">
        <p>By accessing and using <strong>Namma Mart</strong>, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.</p>
      </LegalSection>

      <LegalSection title="2. User Account">
        <p>To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
      </LegalSection>

      <LegalSection title="3. Product Information & Pricing">
        <p>We strive to provide accurate product descriptions and pricing. However, Namma Mart reserves the right to correct any errors and to change or update information at any time without prior notice.</p>
      </LegalSection>
    </LegalWrapper>
  );
}