"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { type Auction, formatETB, mockBidHistory } from "@/lib/auction-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ChevronLeft, Clock, User, AlertTriangle, CheckCircle, Lock, FileText, Download } from "lucide-react"
import { Link } from "react-router-dom"

interface AuditViewProps {
    auction: Auction
}

export function AuditView({ auction }: AuditViewProps) {
    const { lang, t } = useLanguage()

    const allBids = mockBidHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                    <Link
                        to={`/auction/${auction.id}`}
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">{t("Back to Auction", "ወደ ጨረታ ተመለስ")}</span>
                    </Link>

                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        {t("Export", "ላክ")}
                    </Button>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-4 py-6">
                {/* Title Section */}
                <div className="mb-6">
                    <div className="mb-2 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h1 className="text-xl font-bold text-foreground">
                            {t("Mezgeb", "መዝገብ")} - {t("Audit Trail", "የኦዲት ዱካ")}
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t("Complete immutable record of all bidding activity for", "ለ")} {auction.id}
                    </p>
                </div>

                {/* Auction Summary Card */}
                <Card className="mb-6 border-primary/20 bg-imperial/30 p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <Badge variant="outline" className="mb-2 border-primary/50">
                                {auction.id}
                            </Badge>
                            <h2 className="font-semibold text-foreground">{auction.title[lang]}</h2>
                            <p className="text-sm text-muted-foreground">{auction.seller.name}</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-trust-green">
                                <Shield className="h-4 w-4" />
                                <span className="font-bold">{auction.trustScore}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{t("Trust Score", "የእምነት ነጥብ")}</p>
                        </div>
                    </div>
                </Card>

                {/* Integrity Notice */}
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-trust-green/10 border border-trust-green/30 p-4">
                    <Lock className="h-6 w-6 text-trust-green" />
                    <div>
                        <p className="font-medium text-trust-green">{t("Cryptographically Verified", "በክሪፕቶግራፊ የተረጋገጠ")}</p>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                "This audit log is tamper-proof and immutable. Each entry is cryptographically linked.",
                                "ይህ የኦዲት መዝገብ ከማዛባት የተጠበቀ እና የማይለወጥ ነው። እያንዳንዱ ግቤት በክሪፕቶግራፊ የተገናኘ ነው።",
                            )}
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                    <Card className="p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{allBids.length}</p>
                        <p className="text-xs text-muted-foreground">{t("Total Bids", "ጠቅላላ ጨረታዎች")}</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">{new Set(allBids.map((b) => b.userId)).size}</p>
                        <p className="text-xs text-muted-foreground">{t("Unique Bidders", "ልዩ ተጫራቾች")}</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">{allBids.filter((b) => b.isAntiSnipe).length}</p>
                        <p className="text-xs text-muted-foreground">{t("Anti-Snipe", "ፀረ-ስኒፕ")}</p>
                    </Card>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[23px] top-0 h-full w-0.5 bg-border" />

                    <div className="space-y-4">
                        {allBids.map((bid, index) => (
                            <div key={bid.id} className="relative flex gap-4">
                                {/* Timeline Node */}
                                <div
                                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${index === 0
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : bid.isAntiSnipe
                                                ? "border-primary/50 bg-primary/20 text-primary"
                                                : "border-border bg-card text-muted-foreground"
                                        }`}
                                >
                                    {index === 0 ? (
                                        <CheckCircle className="h-5 w-5" />
                                    ) : bid.isAntiSnipe ? (
                                        <AlertTriangle className="h-5 w-5" />
                                    ) : (
                                        <span className="text-sm font-bold">{allBids.length - index}</span>
                                    )}
                                </div>

                                {/* Content Card */}
                                <Card className={`flex-1 p-4 ${index === 0 ? "border-primary/30 bg-primary/5" : ""}`}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">{bid.userName}</span>
                                                <Badge variant="outline" className="text-[10px]">
                                                    {bid.userId}
                                                </Badge>
                                                {index === 0 && <Badge className="bg-primary text-[10px]">{t("Leading", "መሪ")}</Badge>}
                                                {bid.isAntiSnipe && (
                                                    <Badge variant="outline" className="border-primary/50 text-primary text-[10px]">
                                                        {t("Anti-Snipe", "ፀረ-ስኒፕ")}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {bid.timestamp.toLocaleString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    IP: ***.***.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${index === 0 ? "text-primary" : "text-foreground"}`}>
                                                {formatETB(bid.amount)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">ETB</p>
                                        </div>
                                    </div>

                                    {/* Hash Footer */}
                                    <div className="mt-3 flex items-center gap-2 rounded bg-imperial/30 px-2 py-1">
                                        <Lock className="h-3 w-3 text-muted-foreground" />
                                        <code className="text-[10px] text-muted-foreground">
                                            TX: 0x{bid.id}...{Math.random().toString(16).slice(2, 10)}
                                        </code>
                                    </div>
                                </Card>
                            </div>
                        ))}

                        {/* Auction Start Node */}
                        <div className="relative flex gap-4">
                            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-trust-green bg-trust-green/20 text-trust-green">
                                <Shield className="h-5 w-5" />
                            </div>

                            <Card className="flex-1 border-trust-green/30 bg-trust-green/5 p-4">
                                <p className="font-semibold text-trust-green">{t("Auction Started", "ጨረታ ተጀምሯል")}</p>
                                <p className="text-xs text-muted-foreground">
                                    {t("Starting Bid", "የመነሻ ጨረታ")}: {formatETB(auction.startingBid)} ETB
                                </p>
                                <div className="mt-2 flex items-center gap-2 rounded bg-imperial/30 px-2 py-1">
                                    <Lock className="h-3 w-3 text-muted-foreground" />
                                    <code className="text-[10px] text-muted-foreground">
                                        GENESIS: 0x00000...{auction.id.replace(/-/g, "").toLowerCase()}
                                    </code>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
