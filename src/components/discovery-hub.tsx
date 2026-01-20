"use client"

import type React from "react"

import { useLanguage } from "@/contexts/LanguageContext"
import { type AuctionCategory } from "@/lib/auction-data"
import { useEffect, useState } from "react"
import { auctionService } from "@/services/auction.service"
import { AuctionCard } from "@/components/auction-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Building, Car, Heart, Cog, Monitor, Armchair, Factory, Wheat, Flame } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"


const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Building,
    Car,
    Heart,
    Cog,
    Monitor,
    Sofa: Armchair,
    Factory,
    Wheat,
    Flame,
}

const categories: { id: AuctionCategory | "all"; icon: string; label: { en: string; am: string } }[] = [
    { id: "all", icon: "Flame", label: { en: "All Active", am: "ሁሉም ንቁ" } },
    { id: "land", icon: "Building", label: { en: "Land", am: "መሬት" } },
    { id: "vehicle", icon: "Car", label: { en: "Vehicles", am: "መኪናዎች" } },
    { id: "ngo-asset", icon: "Heart", label: { en: "NGO Assets", am: "NGO ንብረቶች" } },
    { id: "machinery", icon: "Cog", label: { en: "Machinery", am: "ማሽነሪዎች" } },
    { id: "electronics", icon: "Monitor", label: { en: "Electronics", am: "ኤሌክትሮኒክስ" } },
    { id: "furniture", icon: "Sofa", label: { en: "Furniture", am: "ዕቃዎች" } },
    { id: "industrial", icon: "Factory", label: { en: "Industrial", am: "ኢንዱስትሪያዊ" } },
    { id: "agricultural", icon: "Wheat", label: { en: "Agricultural", am: "ግብርና" } },
]

export function DiscoveryHub() {
    const { lang, t } = useLanguage()
    const [activeCategory, setActiveCategory] = useState<AuctionCategory | "all">("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [auctions, setAuctions] = useState<any[]>([]) // Replace with Auction[]
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true)
                const params: any = { limit: 12 } // Increase limit for better grid view

                if (activeCategory !== "all") {
                    params.category = activeCategory
                }

                if (searchQuery) {
                    params.search = searchQuery
                }

                // Only fetch active auctions for discovery
                params.status = "active"

                const response = await auctionService.getAll(params)
                setAuctions(response.data || [])
            } catch (error) {
                console.error("Failed to fetch auctions", error)
                // Fallback to empty array on error
                setAuctions([])
            } finally {
                setLoading(false)
            }
        }

        // Debounce search to prevent flashing
        const timeoutId = setTimeout(() => {
            fetchAuctions()
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [activeCategory, searchQuery])

    if (loading && auctions.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                {/* Keep the header structure or just show skeletons in grid */}
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <SkeletonLoader count={1} type="text" className="h-12 w-1/3 mb-4" />
                    <SkeletonLoader count={1} type="text" className="h-24 w-full mb-8" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <SkeletonLoader count={6} type="card" />
                    </div>
                </div>
            </div>
        )
    }

    // No client-side filtering needed anymore
    const filteredAuctions = auctions

    const liveCount = auctions.filter((a) => a.isLive).length

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="border-b border-border/30 bg-muted/30 px-4 py-8 sm:py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex items-center gap-2">
                        <span className="live-indicator h-3 w-3 rounded-full bg-red-500" />
                        <Badge variant="outline" className="border-primary/50 text-primary">
                            {liveCount} {t("Live Auctions", "ቀጥታ ጨረታዎች")}
                        </Badge>
                    </div>

                    <h1 className="mb-3 text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                        {t("Trusted Ethiopian", "የታመነ የኢትዮጵያ")}
                        <br />
                        <span className="text-primary">{t("Digital Marketplace", "ዲጂታል ገበያ")}</span>
                    </h1>

                    <p className="mb-8 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
                        {t(
                            "Secure auctions for land leases, government vehicles, and NGO assets. Full transparency. Complete audit trail.",
                            "ለመሬት ኪራይ፣ የመንግስት መኪናዎች እና የNGO ንብረቶች ደህንነታቸው የተጠበቀ ጨረታዎች። ሙሉ ግልጽነት። ሙሉ የኦዲት ዱካ።",
                        )}
                    </p>

                    {/* Search */}
                    <div className="flex gap-2">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t("Search auctions...", "ጨረታዎችን ይፈልጉ...")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-card pl-10"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="sticky top-14 z-40 border-b border-border/30 bg-background/95 px-4 py-3 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1">
                    {categories.map((cat) => {
                        // @ts-ignore
                        const Icon = iconMap[cat.icon] || Building
                        const isActive = activeCategory === cat.id
                        return (
                            <Button
                                key={cat.id}
                                variant={isActive ? "default" : "ghost"}
                                size="sm"
                                // @ts-ignore
                                onClick={() => setActiveCategory(cat.id)}
                                className={`shrink-0 gap-2 ${isActive ? "" : "text-muted-foreground"}`}
                            >
                                <Icon className="h-4 w-4" />
                                {cat.label[lang]}
                            </Button>
                        )
                    })}
                </div>
            </section>

            {/* Auction Grid */}
            <section className="px-4 py-6 sm:py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {filteredAuctions.length} {t("auctions found", "ጨረታዎች ተገኝተዋል")}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredAuctions.map((auction) => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>

                    {filteredAuctions.length === 0 && (
                        <EmptyState
                            icon={Search}
                            title={t("No auctions found", "ምንም ጨረታ አልተገኘም")}
                            description={t("Try adjusting your search or filters to find what you're looking for.", "የሚፈልጉትን ለማግኘት ፍለጋዎን ወይም ማጣሪያዎን ያስተካክሉ።")}
                            action={{
                                label: t("Clear Filters", "ማጣሪያዎችን አጽዳ"),
                                onClick: () => {
                                    setSearchQuery("")
                                    setActiveCategory("all")
                                }
                            }}
                            className="py-16"
                        />
                    )}
                </div>
            </section>
        </div>
    )
}
