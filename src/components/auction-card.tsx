"use client"

import type React from "react"

import { useLanguage } from "@/contexts/LanguageContext"
import { type Auction, formatETB, categoryDetails } from "@/lib/auction-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Shield,
    MapPin,
    TrendingUp,
    Gavel,
    Building,
    Car,
    Package,
    Cog,
    Monitor,
    Sofa,
    Factory,
    Wheat,
    HelpCircle,
} from "lucide-react"
import { Link } from "react-router-dom"
import { AuctionTimer } from "./auction-timer"

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    land: Building,
    vehicle: Car,
    "ngo-asset": Package,
    machinery: Cog,
    electronics: Monitor,
    furniture: Sofa,
    industrial: Factory,
    agricultural: Wheat,
}

interface AuctionCardProps {
    auction: Auction
}

export function AuctionCard({ auction }: AuctionCardProps) {
    const { lang, t } = useLanguage()

    const CategoryIcon = categoryIcons[auction.category] || HelpCircle
    const categoryLabel = categoryDetails[auction.category]?.label || { en: auction.category, am: auction.category }

    return (
        <Link to={`/auction/${auction.id}`}>
            <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={auction.imageUrl || "/placeholder.svg"}
                        alt={auction.title[lang]}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Live Indicator */}
                    {auction.isLive && (
                        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 backdrop-blur-sm">
                            <span className="live-indicator h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-xs font-semibold text-foreground">{t("LIVE", "ቀጥታ")}</span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <Badge variant="secondary" className="absolute right-3 top-3 gap-1 bg-background/90 backdrop-blur-sm">
                        <CategoryIcon className="h-3 w-3" />
                        {categoryLabel[lang]}
                    </Badge>

                    {/* Trust Score */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-trust-green/90 px-2 py-1 backdrop-blur-sm">
                        <Shield className="h-3 w-3 text-white" />
                        <span className="text-xs font-bold text-white">{auction.trustScore}%</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
                        {auction.title[lang]}
                    </h3>

                    {/* Location */}
                    <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {auction.location[lang]}
                    </div>

                    {/* Price & Stats */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">{t("Current Bid", "የአሁን ጨረታ")}</p>
                            <p className="text-lg font-bold text-primary">
                                {formatETB(auction.currentBid)} <span className="text-xs font-normal text-muted-foreground">ETB</span>
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Gavel className="h-3 w-3" />
                                {auction.bidCount} {t("bids", "ጨረታዎች")}
                            </div>
                            <AuctionTimer endsAt={auction.endsAt} compact />
                        </div>
                    </div>

                    {/* Urgency Bar - Shows when auction is ending soon */}
                    {auction.endsAt.getTime() - Date.now() < 1000 * 60 * 10 && auction.endsAt.getTime() > Date.now() && (
                        <div className="urgency-active mt-3 rounded-md px-2 py-1.5 text-center">
                            <span className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary">
                                <TrendingUp className="h-3 w-3" />
                                {t("Ending Soon!", "በቅርብ ጊዜ ያልቃል!")}
                            </span>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    )
}
