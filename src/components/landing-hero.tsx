"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowRight, CheckCircle, TrendingUp, Users, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { auctionService } from "@/services/auction.service"
import type { Auction } from "@/lib/auction-data"
import { formatETB } from "@/lib/auction-data"

export function LandingHero() {
    const { lang, t } = useLanguage()
    const [stats, setStats] = useState({ liveCount: 0, totalValue: 0 })
    const [featuredAuction, setFeaturedAuction] = useState<Auction | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch active auctions to calculate stats
                // In a real app, this should be a dedicated stats endpoint
                const response = await auctionService.getAll({ status: 'active', limit: 100 })
                const auctions = response.data

                const liveCount = auctions.length
                const totalValue = auctions.reduce((sum, a) => sum + (a.currentBid || a.startingBid), 0)

                setStats({ liveCount, totalValue })

                if (auctions.length > 0) {
                    setFeaturedAuction(auctions[0])
                }
            } catch (error) {
                console.error("Failed to fetch landing stats:", error)
            }
        }
        fetchData()
    }, [])

    return (
        <section className="relative overflow-hidden border-b border-border/30">
            {/* Background pattern */}
            <div className="hero-pattern absolute inset-0 opacity-50" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    {/* Left content */}
                    <div className="text-center lg:text-left">
                        {/* Live badge */}
                        <div className="mb-6 inline-flex items-center gap-2">
                            <span className="live-indicator h-2.5 w-2.5 rounded-full bg-red-500" />
                            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary font-medium">
                                {stats.liveCount} {t("Live Auctions Now", "አሁን ቀጥታ ጨረታዎች")}
                            </Badge>
                        </div>

                        {/* Main headline */}
                        <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            {t("Ethiopia's Most", "የኢትዮጵያ በጣም")}
                            <br />
                            <span className="gradient-text">{t("Trusted Marketplace", "የታመነ ገበያ")}</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="mb-8 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl mx-auto lg:mx-0">
                            {t(
                                "Secure government auctions for land leases, vehicles, and institutional assets. Complete transparency with immutable audit trails.",
                                "ለመሬት ኪራይ፣ ተሽከርካሪዎች እና ተቋማዊ ንብረቶች ደህንነታቸው የተጠበቀ የመንግስት ጨረታዎች። ከማይለወጥ የኦዲት ዱካ ጋር ሙሉ ግልጽነት።",
                            )}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button size="lg" className="gap-2 text-base" asChild>
                                <Link to="/auctions">
                                    {t("Browse Auctions", "ጨረታዎችን ይመልከቱ")}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="gap-2 text-base bg-transparent" asChild>
                                <Link to="/signup">{t("Create Account", "መለያ ይፍጠሩ")}</Link>
                            </Button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 justify-center lg:justify-start text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-trust-green" />
                                {t("Government Verified", "በመንግስት የተረጋገጠ")}
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-trust-green" />
                                {t("Secure Payments", "ደህንነታቸው የተጠበቀ ክፍያዎች")}
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-trust-green" />
                                {t("Full Audit Trail", "ሙሉ የኦዲት ዱካ")}
                            </div>
                        </div>
                    </div>

                    {/* Right content - Stats card */}
                    <div className="relative">
                        <div className="glass-light rounded-2xl p-8 shadow-xl">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center p-4 rounded-xl bg-background/50">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                    </div>
                                    <p className="text-3xl font-bold text-foreground">{formatETB(stats.totalValue)}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{t("Total Bid Value (ETB)", "ጠቅላላ የጨረታ ዋጋ")}</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-background/50">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <p className="text-3xl font-bold text-foreground">2,450+</p>
                                    <p className="text-xs text-muted-foreground mt-1">{t("Verified Bidders", "የተረጋገጡ ተጫራቾች")}</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-background/50">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <p className="text-3xl font-bold text-foreground">98.5%</p>
                                    <p className="text-xs text-muted-foreground mt-1">{t("Trust Score Avg", "አማካይ የታማኝነት ነጥብ")}</p>
                                </div>
                                <div className="text-center p-4 rounded-xl bg-background/50">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <span className="live-indicator h-3 w-3 rounded-full bg-red-500" />
                                    </div>
                                    <p className="text-3xl font-bold text-foreground">{stats.liveCount}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{t("Live Auctions", "ቀጥታ ጨረታዎች")}</p>
                                </div>
                            </div>

                            {/* Featured auction preview */}
                            {featuredAuction && (
                                <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5">
                                    <p className="text-xs font-medium text-primary mb-2">{t("Featured Auction", "ተለይቶ የቀረበ ጨረታ")}</p>
                                    <p className="font-semibold text-foreground text-sm mb-1">{featuredAuction.title[lang]}</p>
                                    <p className="text-lg font-bold text-primary">{formatETB(featuredAuction.currentBid)} ETB</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
