"use client"

import { useParams } from "react-router-dom"
import { WinnerPayment } from "@/components/winner-payment"
import { useEffect, useState } from "react"
import { auctionService } from "@/services/auction.service"

export default function WinnerPaymentPage() {
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
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!auction) {
        return (
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-xl font-bold">Auction not found</h1>
            </div>
        )
    }

    const winningBid = typeof auction.currentPrice === 'string'
        ? parseFloat(auction.currentPrice)
        : auction.currentPrice

    return <WinnerPayment auction={auction} winningBid={winningBid} />
}
