import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";

export default function LandingPage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
