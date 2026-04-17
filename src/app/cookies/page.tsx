import LegalWrapper, { LegalSection } from "@/components/legal/LegalPageWrapper";

export default function CookiePage() {
  return (
    <LegalWrapper title="Cookie Policy" lastUpdated="Apirl 206">
      <LegalSection title="1. What are Cookies?">
        <p>Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser that enables the site's systems to recognize your browser and capture certain information.</p>
      </LegalSection>

      <LegalSection title="2. Why Namma Mart uses Cookies">
        <ul className="list-disc pl-5 space-y-2">
          <li>To help remember and process the items in your shopping cart.</li>
          <li>To understand and save your preferences for future visits.</li>
          <li>To compile aggregate data about site traffic and site interaction.</li>
        </ul>
      </LegalSection>
    </LegalWrapper>
  );
}