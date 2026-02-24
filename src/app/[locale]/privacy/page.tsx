import { LegalPage } from "@/components/legal-page";

const sections = [
  { titleKey: "section1Title", contentKey: "section1Content" },
  { titleKey: "section2Title", contentKey: "section2Content" },
  { titleKey: "section3Title", contentKey: "section3Content" },
  { titleKey: "section4Title", contentKey: "section4Content" },
  { titleKey: "section5Title", contentKey: "section5Content" },
  { titleKey: "section6Title", contentKey: "section6Content" },
  { titleKey: "section7Title", contentKey: "section7Content" },
];

export default function PrivacyPage() {
  return <LegalPage namespace="privacy" sections={sections} />;
}
