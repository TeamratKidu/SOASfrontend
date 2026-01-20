"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Clock, AlertTriangle } from "lucide-react"

interface AuctionTimerProps {
    endsAt: Date
    compact?: boolean
}

export function AuctionTimer({ endsAt, compact = false }: AuctionTimerProps) {
    const { t } = useLanguage()
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endsAt))

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(endsAt))
        }, 1000)
        return () => clearInterval(interval)
    }, [endsAt])

    function calculateTimeLeft(endDate: Date) {
        const now = new Date()
        const diff = endDate.getTime() - now.getTime()

        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true, urgent: false }
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        return {
            days,
            hours,
            minutes,
            seconds,
            ended: false,
            urgent: diff < 1000 * 60 * 10, // Under 10 minutes
        }
    }

    if (timeLeft.ended) {
        return (
            <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">{t("Ended", "አልቋል")}</span>
            </div>
        )
    }

    if (compact) {
        if (timeLeft.days > 0) {
            return (
                <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-sm">
                        {timeLeft.days}d {timeLeft.hours}h
                    </span>
                </div>
            )
        }
        if (timeLeft.hours > 0) {
            return (
                <div className={`flex items-center gap-1 ${timeLeft.urgent ? "text-primary" : "text-muted-foreground"}`}>
                    <Clock className={`h-3.5 w-3.5 ${timeLeft.urgent ? "animate-pulse" : ""}`} />
                    <span className="text-sm">
                        {timeLeft.hours}h {timeLeft.minutes}m
                    </span>
                </div>
            )
        }
        return (
            <div className="flex items-center gap-1 text-primary animate-pulse">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span className="text-sm font-bold">
                    {timeLeft.minutes}:{timeLeft.seconds.toString().padStart(2, "0")}
                </span>
            </div>
        )
    }

    // Full timer display
    return (
        <div className={`flex items-center gap-3 ${timeLeft.urgent ? "text-primary" : "text-foreground"}`}>
            {timeLeft.urgent && <AlertTriangle className="h-5 w-5 animate-pulse" />}
            <div className="flex gap-2">
                {timeLeft.days > 0 && (
                    <div className="text-center">
                        <div className="text-2xl font-bold">{timeLeft.days}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{t("Days", "ቀናት")}</div>
                    </div>
                )}
                <div className="text-center">
                    <div className={`text-2xl font-bold ${timeLeft.urgent ? "animate-pulse" : ""}`}>
                        {timeLeft.hours.toString().padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">{t("Hrs", "ሰዓ")}</div>
                </div>
                <span className="text-2xl font-bold">:</span>
                <div className="text-center">
                    <div className={`text-2xl font-bold ${timeLeft.urgent ? "animate-pulse" : ""}`}>
                        {timeLeft.minutes.toString().padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">{t("Min", "ደቂ")}</div>
                </div>
                <span className="text-2xl font-bold">:</span>
                <div className="text-center">
                    <div className={`text-2xl font-bold ${timeLeft.urgent ? "animate-pulse" : ""}`}>
                        {timeLeft.seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">{t("Sec", "ሰከ")}</div>
                </div>
            </div>
        </div>
    )
}
