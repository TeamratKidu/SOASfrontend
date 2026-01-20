"use client"

import { useParams } from "react-router-dom"
import { AuctionDetailPremium } from "@/components/auction-detail-premium"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import { auctionService } from "@/services/auction.service"

export default function AuctionDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [auction, setAuction] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return

        const fetchAuction = async () => {
            try {
                setLoading(true)
                const data = await auctionService.getById(id)
                setAuction(data)
            } catch (error) {
                console.error("Failed to fetch auction:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAuction()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!auction) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <h1 className="text-2xl font-bold">Auction not found</h1>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <AuctionDetailPremium auction={auction} />
            <Footer />
        </div>
    )
}
