import { AxumHeader } from "@/components/axum-header"
import { LandingHero } from "@/components/landing-hero"
import { FeaturedAuctions } from "@/components/featured-auctions"
import { CategoryShowcase } from "@/components/category-showcase"
import { HowItWorks } from "@/components/how-it-works"
import { TrustSection } from "@/components/trust-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <AxumHeader />
            <main className="flex-1">
                <LandingHero />
                <FeaturedAuctions />
                <CategoryShowcase />
                <HowItWorks />
                <TrustSection />
            </main>
            <Footer />
        </div>
    )
}
