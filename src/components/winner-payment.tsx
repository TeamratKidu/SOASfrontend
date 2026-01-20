"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { type Auction, formatETB } from "@/lib/auction-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Trophy,
    Clock,
    Shield,
    ChevronRight,
    AlertCircle,
    CheckCircle,
    Smartphone,
    CreditCard,
    Building,
} from "lucide-react"
import { useEffect, useState } from "react"
import { AxumHeader } from "@/components/axum-header"
import { Footer } from "@/components/footer"

interface WinnerPaymentProps {
    auction: Auction
    winningBid: number
}

export function WinnerPayment({ auction, winningBid }: WinnerPaymentProps) {
    const { lang, t } = useLanguage()
    const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60) // 24 hours in seconds
    const [selectedMethod, setSelectedMethod] = useState<"telebirr" | "chapa" | "bank" | null>(null)
    const [processing, setProcessing] = useState(false)
    const [completed, setCompleted] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining((t) => Math.max(0, t - 1))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const hours = Math.floor(timeRemaining / 3600)
    const minutes = Math.floor((timeRemaining % 3600) / 60)
    const seconds = timeRemaining % 60

    const handlePayment = () => {
        if (!selectedMethod) return
        if (selectedMethod === "telebirr") {
            // Telebirr coming soon – ignore real processing for now
            return
        }
        setProcessing(true)

        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false)
            setCompleted(true)
        }, 3000)
    }

    if (completed) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <Card className="max-w-md border-trust-green/30 bg-trust-green/5 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-trust-green">
                        <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-trust-green">{t("Payment Successful!", "ክፍያ ተሳክቷል!")}</h1>
                    <p className="mb-6 text-muted-foreground">
                        {t(
                            "Your payment has been received. You will receive a confirmation email shortly.",
                            "ክፍያዎ ደርሷል። በቅርቡ የማረጋገጫ ኢሜይል ይደርስዎታል።",
                        )}
                    </p>
                    <Badge className="bg-trust-green text-lg px-4 py-2">{formatETB(winningBid)} ETB</Badge>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AxumHeader />
            <div className="flex-1 p-4">
                <div className="mx-auto max-w-lg py-8">
                    {/* Winner Badge */}
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary gold-glow">
                            <Trophy className="h-10 w-10 text-primary-foreground" />
                        </div>
                        <h1 className="mb-1 text-2xl font-bold text-foreground">{t("Congratulations!", "እንኳን ደስ አለዎት!")}</h1>
                        <p className="text-muted-foreground">{t("You won the auction", "ጨረታውን አሸንፈዋል")}</p>
                    </div>

                    {/* Auction Summary */}
                    <Card className="mb-6 p-4">
                        <Badge variant="outline" className="mb-2">
                            {auction.id}
                        </Badge>
                        <h2 className="font-semibold text-foreground">{auction.title[lang]}</h2>
                        <p className="text-sm text-muted-foreground">{auction.seller.name}</p>

                        <div className="mt-4 rounded-lg bg-primary/10 p-4 text-center">
                            <p className="text-sm text-muted-foreground">{t("Winning Bid", "አሸናፊ ጨረታ")}</p>
                            <p className="text-3xl font-bold text-primary">{formatETB(winningBid)} ETB</p>
                        </div>
                    </Card>

                    {/* Payment Deadline */}
                    <Card
                        className={`mb-6 p-4 ${timeRemaining < 3600 ? "border-destructive/50 bg-destructive/5" : "border-primary/30"}`}
                    >
                        <div className="flex items-center gap-3">
                            <Clock className={`h-6 w-6 ${timeRemaining < 3600 ? "text-destructive" : "text-primary"}`} />
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">{t("Payment Deadline", "የክፍያ የመጨረሻ ቀን")}</p>
                                <p className={`text-2xl font-bold ${timeRemaining < 3600 ? "text-destructive" : "text-foreground"}`}>
                                    {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:
                                    {seconds.toString().padStart(2, "0")}
                                </p>
                            </div>
                        </div>

                        {timeRemaining < 3600 && (
                            <div className="mt-3 flex items-center gap-2 text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">{t("Less than 1 hour remaining!", "ከ1 ሰዓት ያነሰ ቀርቷል!")}</span>
                            </div>
                        )}
                    </Card>

                    {/* Payment Methods */}
                    <div className="mb-6">
                        <h3 className="mb-3 font-semibold text-foreground">{t("Select Payment Method", "የክፍያ ዘዴ ይምረጡ")}</h3>

                        <div className="space-y-3">
                            {/* Telebirr - coming soon placeholder */}
                            <button
                                type="button"
                                disabled
                                className="w-full cursor-not-allowed rounded-xl border border-dashed border-border/70 bg-muted/40 p-4 text-left opacity-70"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00A859]">
                                        <Smartphone className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">Telebirr</p>
                                        <p className="text-sm text-muted-foreground">
                                            {t("Coming soon – sandbox only for now", "በቅርቡ ይመጣል – አሁን ሳንድቦክስ ብቻ")}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                            </button>

                            {/* Chapa */}
                            <button
                                onClick={() => setSelectedMethod("chapa")}
                                className={`w-full rounded-xl border p-4 text-left transition-all ${selectedMethod === "chapa"
                                        ? "border-primary bg-primary/10"
                                        : "border-border bg-card hover:border-primary/50"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7C3AED]">
                                        <CreditCard className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">Chapa</p>
                                        <p className="text-sm text-muted-foreground">{t("Card / Bank Transfer", "ካርድ / የባንክ ዝውውር")}</p>
                                    </div>
                                    <ChevronRight
                                        className={`h-5 w-5 ${selectedMethod === "chapa" ? "text-primary" : "text-muted-foreground"}`}
                                    />
                                </div>
                            </button>

                            {/* Bank Transfer */}
                            <button
                                onClick={() => setSelectedMethod("bank")}
                                className={`w-full rounded-xl border p-4 text-left transition-all ${selectedMethod === "bank"
                                        ? "border-primary bg-primary/10"
                                        : "border-border bg-card hover:border-primary/50"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-imperial-light">
                                        <Building className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">{t("Direct Bank Transfer", "ቀጥታ የባንክ ዝውውር")}</p>
                                        <p className="text-sm text-muted-foreground">{t("CBE / Awash / Dashen", "CBE / አዋሽ / ዳሽን")}</p>
                                    </div>
                                    <ChevronRight
                                        className={`h-5 w-5 ${selectedMethod === "bank" ? "text-primary" : "text-muted-foreground"}`}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mb-6 flex items-start gap-3 rounded-lg bg-imperial/30 p-3">
                        <Shield className="h-5 w-5 shrink-0 text-primary" />
                        <div>
                            <p className="text-sm font-medium text-foreground">{t("Secure Transaction", "ደህንነቱ የተጠበቀ ግብይት")}</p>
                            <p className="text-xs text-muted-foreground">
                                {t(
                                    "Your payment is protected by 256-bit encryption and monitored for fraud.",
                                    "ክፍያዎ በ256-ቢት ምስጠራ የተጠበቀ እና ለማጭበርበር ክትትል የሚደረግ ነው።",
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Pay Button */}
                    <Button
                        onClick={handlePayment}
                        disabled={!selectedMethod || processing}
                        className="w-full py-6 text-lg font-bold"
                        size="lg"
                    >
                        {processing ? (
                            <span className="flex items-center gap-2">
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                {t("Processing...", "በሂደት ላይ...")}
                            </span>
                        ) : (
                            t("Pay Now", "አሁን ይክፈሉ")
                        )}
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    )
}
