"use client"

import type React from "react"

import { useLanguage } from "@/contexts/LanguageContext"
import { formatETB } from "@/lib/auction-data"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, ChevronRight, Shield } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface SlideToBidProps {
    currentBid: number
    onBidPlaced: (amount: number) => void
    onClose: () => void
}

const quickIncrements = [100, 500, 1000, 5000, 10000]

export function SlideToBidInterface({ currentBid, onBidPlaced, onClose }: SlideToBidProps) {
    const { t } = useLanguage()
    const [bidAmount, setBidAmount] = useState(currentBid + 100)
    const [slideProgress, setSlideProgress] = useState(0)
    const [isSliding, setIsSliding] = useState(false)
    const [confirmed, setConfirmed] = useState(false)
    const trackRef = useRef<HTMLDivElement>(null)
    const thumbRef = useRef<HTMLDivElement>(null)

    const minBid = currentBid + 100

    const handleIncrement = (amount: number) => {
        setBidAmount((prev) => prev + amount)
    }

    const handleDecrement = (amount: number) => {
        setBidAmount((prev) => Math.max(minBid, prev - amount))
    }

    // Touch/mouse slide handling
    // Touch/mouse slide handling
    const handleSlideStart = () => {
        setIsSliding(true)
    }

    const handleSlideMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isSliding || !trackRef.current) return

        const track = trackRef.current.getBoundingClientRect()
        // @ts-ignore
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
        const progress = Math.max(0, Math.min(1, (clientX - track.left - 28) / (track.width - 56)))
        setSlideProgress(progress)

        if (progress >= 0.95) {
            setConfirmed(true)
            setIsSliding(false)
            setTimeout(() => {
                onBidPlaced(bidAmount)
            }, 500)
        }
    }

    const handleSlideEnd = () => {
        if (!confirmed) {
            setSlideProgress(0)
        }
        setIsSliding(false)
    }

    useEffect(() => {
        const handleGlobalMove = (e: TouchEvent | MouseEvent) => {
            if (isSliding) {
                // @ts-ignore
                handleSlideMove(e)
            }
        }

        const handleGlobalEnd = () => {
            handleSlideEnd()
        }

        window.addEventListener("touchmove", handleGlobalMove)
        window.addEventListener("mousemove", handleGlobalMove)
        window.addEventListener("touchend", handleGlobalEnd)
        window.addEventListener("mouseup", handleGlobalEnd)

        return () => {
            window.removeEventListener("touchmove", handleGlobalMove)
            window.removeEventListener("mousemove", handleGlobalMove)
            window.removeEventListener("touchend", handleGlobalEnd)
            window.removeEventListener("mouseup", handleGlobalEnd)
        }
    }, [isSliding, confirmed])

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            {/* Bottom Sheet */}
            <div className="relative w-full max-w-lg animate-in slide-in-from-bottom rounded-t-3xl bg-card border-t border-x border-border/50 p-6 pb-8">
                {/* Handle */}
                <div className="absolute left-1/2 top-3 h-1 w-12 -translate-x-1/2 rounded-full bg-border" />

                {/* Close */}
                <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
                    <X className="h-5 w-5" />
                </Button>

                {/* Header */}
                <div className="mb-6 text-center">
                    <h3 className="text-lg font-bold text-foreground">{t("Place Your Bid", "ጨረታዎን ያስገቡ")}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t("Minimum bid", "ዝቅተኛ ጨረታ")}: {formatETB(minBid)} ETB
                    </p>
                </div>

                {/* Bid Amount Display */}
                <div className="mb-6 rounded-2xl bg-imperial/50 p-6 text-center">
                    <p className="mb-1 text-sm text-muted-foreground">{t("Your Bid Amount", "የእርስዎ የጨረታ መጠን")}</p>
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDecrement(100)}
                            disabled={bidAmount <= minBid}
                            className="h-12 w-12 rounded-full"
                        >
                            <Minus className="h-5 w-5" />
                        </Button>

                        <div>
                            <span className="text-4xl font-bold text-primary">{formatETB(bidAmount)}</span>
                            <span className="ml-2 text-lg text-muted-foreground">ETB</span>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleIncrement(100)}
                            className="h-12 w-12 rounded-full"
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>

                    <p className="mt-2 text-sm text-trust-green">
                        +{formatETB(bidAmount - currentBid)} {t("above current", "ከአሁኑ በላይ")}
                    </p>
                </div>

                {/* Quick Increment Buttons */}
                <div className="mb-6 flex flex-wrap justify-center gap-2">
                    {quickIncrements.map((amount) => (
                        <Button key={amount} variant="outline" size="sm" onClick={() => handleIncrement(amount)} className="gap-1">
                            <Plus className="h-3 w-3" />
                            {formatETB(amount)}
                        </Button>
                    ))}
                </div>

                {/* Security Notice */}
                <div className="mb-6 flex items-start gap-3 rounded-lg bg-imperial/30 p-3">
                    <Shield className="h-5 w-5 shrink-0 text-primary" />
                    <div>
                        <p className="text-sm font-medium text-foreground">{t("Secure & Binding", "ደህንነቱ የተጠበቀ እና አስገዳጅ")}</p>
                        <p className="text-xs text-muted-foreground">
                            {t(
                                "Your bid is legally binding. All bids are recorded in the immutable audit log.",
                                "ጨረታዎ ህጋዊ አስገዳጅ ነው። ሁሉም ጨረታዎች በማይለወጥ የኦዲት መዝገብ ውስጥ ይመዘገባሉ።",
                            )}
                        </p>
                    </div>
                </div>

                {/* Slide to Confirm Track */}
                <div
                    ref={trackRef}
                    className={`relative h-16 overflow-hidden rounded-full transition-all ${confirmed ? "bg-trust-green" : "slide-track border border-primary/30"
                        }`}
                    onMouseDown={handleSlideStart}
                    onTouchStart={handleSlideStart}
                >
                    {/* Fill */}
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-primary/20 transition-all"
                        style={{ width: `${slideProgress * 100}%` }}
                    />

                    {/* Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span
                            className={`font-semibold transition-opacity ${slideProgress > 0.3 ? "opacity-0" : "opacity-100"} ${confirmed ? "text-white" : "text-muted-foreground"}`}
                        >
                            {confirmed ? t("Bid Confirmed!", "ጨረታ ተረጋግጧል!") : t("Slide to Confirm", "ለማረጋገጥ ያንሸራትቱ")}
                        </span>
                    </div>

                    {/* Thumb */}
                    {!confirmed && (
                        <div
                            ref={thumbRef}
                            className="absolute top-2 h-12 w-12 cursor-grab rounded-full bg-primary shadow-lg transition-all active:cursor-grabbing flex items-center justify-center"
                            style={{ left: `calc(${slideProgress * 100}% * (1 - 56px / 100%) + 8px)` }}
                        >
                            <ChevronRight className="h-6 w-6 text-primary-foreground" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
