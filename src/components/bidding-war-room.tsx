"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { type Auction, formatETB, formatTimeRemaining, mockBidHistory } from "@/lib/auction-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, MapPin, Clock, TrendingUp, Users, AlertTriangle, ChevronLeft, Eye, History } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { SlideToBidInterface } from "./slide-to-bid"
import { AuctionDetailsSection } from "./auction-details-section"
import { useBidding } from "@/hooks/use-bidding"

interface BiddingWarRoomProps {
    auction: Auction
}

export function BiddingWarRoom({ auction }: BiddingWarRoomProps) {
    const { lang, t } = useLanguage()

    // Initialize bidding hook with initial data from the auction prop
    const { currentPrice, endTime, bids, placeBid, isConnected } = useBidding(auction.id, {
        price: auction.currentBid,
        endsAt: auction.endsAt,
        bids: mockBidHistory // Ideally this comes from props too
    })

    const [timeLeft, setTimeLeft] = useState(formatTimeRemaining(endTime))
    // Anti-snipe visual effect state can be re-enabled if needed based on endTime extensions
    const [antiSnipeActive] = useState(false)
    const [showBidSheet, setShowBidSheet] = useState(false)

    // Update time remaining based on live endTime
    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = formatTimeRemaining(endTime)
            setTimeLeft(newTimeLeft)
        }, 1000)
        return () => clearInterval(interval)
    }, [endTime])

    const handleBidPlaced = (amount: number) => {
        placeBid(amount)
        setShowBidSheet(false)
    }

    // Merge initial mock history with live bids from hook
    const displayBids = bids.length > 0 ? bids : mockBidHistory

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">{t("Back", "ተመለስ")}</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <Badge variant="outline" className="gap-1 border-green-500/50 text-green-500">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                {t("Live", "ቀጥታ")}
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="gap-1 border-yellow-500/50 text-yellow-500">
                                {t("Connecting...", "በመገናኘት ላይ...")}
                            </Badge>
                        )}
                        <Badge variant="outline" className="gap-1 border-primary/50">
                            <Eye className="h-3 w-3" />
                            247 {t("watching", "እያዩ")}
                        </Badge>
                        <Link to={`/audit/${auction.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                                <History className="h-4 w-4" />
                                <span className="hidden sm:inline">{t("Audit Log", "የኦዲት መዝገብ")}</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Image */}
            <div className="relative aspect-video max-h-[300px] w-full overflow-hidden sm:aspect-[21/9]">
                <img
                    src={auction.imageUrl || "/placeholder.svg"}
                    alt={auction.title[lang]}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                {/* Trust Badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-trust-green px-3 py-1.5">
                    <Shield className="h-4 w-4 text-white" />
                    <span className="text-sm font-bold text-white">
                        {t("Trust Score", "የእምነት ነጥብ")}: {auction.trustScore}%
                    </span>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4">
                {/* Title & Info */}
                <div className="py-6">
                    <div className="mb-2 flex items-center gap-2">
                        <Badge variant="secondary">{auction.id}</Badge>
                        {auction.seller.verified && (
                            <Badge variant="outline" className="gap-1 border-trust-green/50 text-trust-green">
                                <Shield className="h-3 w-3" />
                                {t("Verified", "የተረጋገጠ")}
                            </Badge>
                        )}
                    </div>

                    <h1 className="mb-2 text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">{auction.title[lang]}</h1>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {auction.location[lang]}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {auction.bidCount + bids.length} {t("bids", "ጨረታዎች")}
                        </span>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">{auction.description[lang]}</p>
                </div>

                {/* Glassmorphism Bid Card */}
                <Card className={`glass relative overflow-hidden rounded-2xl p-6 ${antiSnipeActive ? "gold-glow" : ""}`}>
                    {/* Anti-Snipe Alert */}
                    {antiSnipeActive && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-3">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-primary">
                                    {t("Anti-Sniping Protection Active", "ፀረ-ስኒፒንግ ጥበቃ ንቁ")}
                                </p>
                                <p className="text-xs text-primary/80">
                                    {t("Timer extended due to late bid", "በዘገየ ጨረታ ምክንያት ጊዜ ተራዝሟል")}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Current Bid */}
                        <div>
                            <p className="mb-1 text-sm text-muted-foreground">{t("Current Highest Bid", "የአሁን ከፍተኛ ጨረታ")}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-primary sm:text-5xl">{formatETB(currentPrice)}</span>
                                <span className="text-lg text-muted-foreground">ETB</span>
                            </div>
                            <p className="mt-1 flex items-center gap-1 text-sm text-trust-green">
                                <TrendingUp className="h-4 w-4" />+{formatETB(currentPrice - auction.startingBid)}{" "}
                                {t("from start", "ከመነሻ")}
                            </p>
                        </div>

                        {/* Time Remaining - Enhanced */}
                        <div className="text-right sm:text-left">
                            <p className="mb-1 text-sm text-muted-foreground">{t("Time Remaining", "የቀረው ጊዜ")}</p>
                            <div className={`flex items-center gap-2 ${timeLeft.urgent ? "text-primary" : "text-foreground"}`}>
                                <Clock className={`h-6 w-6 ${timeLeft.urgent ? "animate-pulse" : ""}`} />
                                <span className={`text-3xl font-bold sm:text-4xl ${timeLeft.urgent ? "animate-pulse" : ""}`}>
                                    {timeLeft.text}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t("Seller", "ሻጭ")}: {auction.seller.name}
                            </p>
                        </div>
                    </div>

                    {/* Bid Button */}
                    <Button onClick={() => setShowBidSheet(true)} className="mt-6 w-full py-6 text-lg font-bold" size="lg">
                        {t("Place Your Bid", "ጨረታዎን ያስገቡ")}
                    </Button>
                </Card>

                <div className="mt-6">
                    <AuctionDetailsSection auction={auction} />
                </div>

                {/* Recent Bids */}
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{t("Recent Bids", "የቅርብ ጊዜ ጨረታዎች")}</h3>
                        <Link to={`/audit/${auction.id}`}>
                            <Button variant="ghost" size="sm">
                                {t("View All", "ሁሉንም ይመልከቱ")}
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-2">
                        {displayBids.slice(0, 5).map((bid: any, index: number) => (
                            <div
                                key={bid.id}
                                className={`flex items-center justify-between rounded-lg px-4 py-3 ${index === 0 ? "bg-primary/10 border border-primary/20" : "bg-card"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {bid.userName} <span className="text-xs text-muted-foreground">{bid.userId}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {bid.timestamp.toLocaleTimeString()}
                                            {bid.isAntiSnipe && (
                                                <Badge variant="outline" className="ml-2 text-[10px] border-primary/50 text-primary">
                                                    Anti-Snipe
                                                </Badge>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-bold ${index === 0 ? "text-primary" : "text-foreground"}`}>
                                    {formatETB(bid.amount)} ETB
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Slide to Bid Interface */}
            {showBidSheet && (
                <SlideToBidInterface
                    currentBid={currentPrice}
                    onBidPlaced={handleBidPlaced}
                    onClose={() => setShowBidSheet(false)}
                />
            )}
        </div>
    )
}
