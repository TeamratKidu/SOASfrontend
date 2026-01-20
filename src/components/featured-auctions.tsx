"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { AuctionCard } from "@/components/auction-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { auctionService } from "@/services/auction.service"
import type { Auction } from "@/lib/auction-data"

export function FeaturedAuctions() {
    const { t } = useLanguage()
    const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBufferedAuctions = async () => {
            try {
                // Fetch active auctions, limit 4
                const response = await auctionService.getAll({
                    status: 'active',
                    limit: 4,
                    page: 1
                })
                setFeaturedAuctions(response.data)
            } catch (error) {
                console.error("Failed to fetch featured auctions:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBufferedAuctions()
    }, [])

    if (isLoading) {
        return <div className="py-16 text-center">Loading featured auctions...</div>
    }

    return (
        <section className="py-16 px-4">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                            {t("Featured Auctions", "ተለይተው የቀረቡ ጨረታዎች")}
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            {t("High-value opportunities ending soon", "በቅርቡ የሚያልቁ ከፍተኛ ዋጋ ያላቸው ዕድሎች")}
                        </p>
                    </div>
                    <Button variant="ghost" className="gap-2 hidden sm:flex" asChild>
                        <Link to="/auctions">
                            {t("View All", "ሁሉንም ይመልከቱ")}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredAuctions.length > 0 ? (
                        featuredAuctions.map((auction) => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-muted-foreground">
                            {t("No active auctions at the moment.", "በአሁኑ ጊዜ ምንም ንቁ ጨረታዎች የሉም።")}
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center sm:hidden">
                    <Button variant="outline" className="gap-2 bg-transparent" asChild>
                        <Link to="/auctions">
                            {t("View All Auctions", "ሁሉንም ጨረታዎች ይመልከቱ")}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
