import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { connectSocket, getSocket } from "@/lib/socket"
import { toast } from "sonner"
import type { Bid as AuctionDataBid } from "@/lib/auction-data" // Import existing types

export function useBidding(auctionId: string, initialData?: { price: number; endsAt: Date; bids: AuctionDataBid[] }) {
    const { user } = useAuth()
    const [isConnected, setIsConnected] = useState(false)

    // Live state
    const [currentPrice, setCurrentPrice] = useState(initialData?.price || 0)
    const [endTime, setEndTime] = useState(initialData?.endsAt || new Date())
    const [bids, setBids] = useState<AuctionDataBid[]>(initialData?.bids || [])

    useEffect(() => {
        // Connect socket when hook mounts or user changes
        const socket = connectSocket(user?.id)

        function onConnect() {
            setIsConnected(true)
            console.log("Socket connected, joining auction:", auctionId)
            socket.emit("join-auction", { auctionId })
        }

        function onDisconnect() {
            setIsConnected(false)
        }

        function onBidAccepted(payload: { bid: any; auction: any }) {
            console.log("Bid accepted:", payload)

            // Update price
            setCurrentPrice(payload.bid.amount)

            // Add to bid history (convert backend bid format to frontend format if needed)
            // Assuming payload.bid matches our needs mostly
            const newBid: AuctionDataBid = {
                id: payload.bid.id,
                auctionId: auctionId,
                userId: payload.bid.bidderId,
                userName: "Bidder", // Backend should ideally send this or we fetch it
                amount: payload.bid.amount,
                timestamp: new Date(payload.bid.timestamp),
                isAntiSnipe: false // We could derive this if needed
            }

            setBids((prev) => [newBid, ...prev])
            toast.success(`New bid accepted: ETB ${payload.bid.amount.toLocaleString()}`)
        }

        function onAuctionExtended(payload: { newEndTime: Date; message: string }) {
            console.log("Auction extended:", payload)
            setEndTime(new Date(payload.newEndTime))
            toast.info(payload.message)
        }

        function onBidRejected(payload: { error: string }) {
            console.error("Bid rejected:", payload)
            toast.error(payload.error)
        }

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("bid-accepted", onBidAccepted)
        socket.on("auction-extended", onAuctionExtended)
        socket.on("bid-rejected", onBidRejected)

        // If already connected, join immediately
        if (socket.connected) {
            onConnect()
        }

        return () => {
            console.log("Leaving auction:", auctionId)
            socket.emit("leave-auction", { auctionId })
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off("bid-accepted", onBidAccepted)
            socket.off("auction-extended", onAuctionExtended)
            socket.off("bid-rejected", onBidRejected)
        }
    }, [auctionId, user])

    const placeBid = useCallback(
        (amount: number) => {
            if (!user) {
                toast.error("You must be logged in to bid")
                return
            }
            const socket = getSocket()
            socket.emit("place-bid", { auctionId, amount })
        },
        [auctionId, user],
    )

    return {
        isConnected,
        currentPrice,
        endTime,
        bids,
        placeBid,
    }
}
