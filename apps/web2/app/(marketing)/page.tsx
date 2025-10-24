import Footer from "@/components/footer";
import HeroSection from "@/components/marketing/hero-section";

export default function MarketingPage() {
  return (
    <>
      {/* <Header /> */}
      <div className="md:min-h-dvh p-4 flex flex-col light">
        <HeroSection />
      </div>
      {/* <LogosSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection /> */}
      <Footer />
    </>
  );
}
