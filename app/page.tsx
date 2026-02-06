import type { Metadata } from "next";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  TrustSection,
  CTASection,
} from "@/components/marketing/Sections";

export const metadata: Metadata = {
  title: "OpenCamp",
  description:
    "Learn programming with real execution, community feedback, and verifiable progress. A language-agnostic platform for mastering software engineering through hands-on practice.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--app-bg)]">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
