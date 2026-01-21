"use client"

import { useState, useEffect } from "react"
import { useSocket } from "@/contexts/SocketContext"
import { useAuthStore } from "@/stores/authStore"
import type { Auction } from "@/lib/auction-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ChevronLeft,
    ChevronRight,
    Verified,
    History,
    Lock,
    Gavel,
    MapPin
} from "lucide-react"
import { AxumHeader } from "./axum-header"
import { FeedbackSection } from "./feedback-section"

interface AuctionDetailPremiumProps {
    auction: Auction
}

interface Bid {
    amount: number
    bidderId: string
    timestamp: string
    bidder?: {
        username: string
    }
}

export function AuctionDetailPremium({ auction }: AuctionDetailPremiumProps) {
    const { socket } = useSocket()
    const { user } = useAuthStore()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [bidAmount, setBidAmount] = useState("")
    const [bidHistory, setBidHistory] = useState<Bid[]>([])
    const [timeRemaining, setTimeRemaining] = useState("")
    const [activeTab, setActiveTab] = useState("overview")
    const [currentBid, setCurrentBid] = useState(auction.currentBid) // Local state for real-time updates
    const [isPlacingBid, setIsPlacingBid] = useState(false) // Loading state

    const [localEndsAt, setLocalEndsAt] = useState(new Date(auction.endsAt))
    const [showFeedback, setShowFeedback] = useState(false)

    // Update localEndsAt if prop changes
    useEffect(() => {
        setLocalEndsAt(new Date(auction.endsAt))
    }, [auction.endsAt])

    // Update currentBid when auction prop changes
    useEffect(() => {
        setCurrentBid(auction.currentBid)
    }, [auction.currentBid])

    // Calculate time remaining
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date()
            const diff = localEndsAt.getTime() - now.getTime()

            if (diff <= 0) {
                setTimeRemaining("ENDED")
                clearInterval(interval)
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [localEndsAt])

    // Initial Bid History Fetch
    useEffect(() => {
        if (!auction.id || !socket || !socket.connected) return;

        console.log('📜 Fetching bid history for auction:', auction.id)

        socket.emit('get-bid-history', { auctionId: auction.id });

        const handleHistory = (data: { bids: any[] }) => {
            console.log('📜 Bid history received:', data.bids.length, 'bids')
            // Map backend history format to frontend Bid interface
            const mappedBids = data.bids.map(b => ({
                amount: b.amount,
                bidderId: b.bidder.id, // Backend returns bidder.id
                timestamp: b.timestamp,
                bidder: {
                    username: b.bidder.username
                }
            }));
            setBidHistory(mappedBids);
        };

        socket.on('bid-history', handleHistory);

        return () => {
            socket.off('bid-history', handleHistory);
        }
    }, [socket, socket?.connected, auction.id]);

    // WebSocket listeners
    useEffect(() => {
        if (!socket) return

        socket.emit('join-auction', { auctionId: auction.id })

        socket.on('bid-accepted', (data) => {
            console.log('📥 Bid accepted event received:', data)

            // Add new bid to history at the top
            const newBid: Bid = {
                amount: data.bid.amount,
                bidderId: data.bid.bidderId,
                timestamp: data.bid.timestamp || new Date().toISOString(),
                bidder: {
                    username: data.bid.bidder?.username || 'Anonymous'
                }
            }

            setBidHistory(prev => [newBid, ...prev])

            // Update current bid from the auction data in the response
            if (data.auction?.currentPrice) {
                setCurrentBid(data.auction.currentPrice)
            }
        })

        socket.on('auction-extended', (data: { newEndTime: string }) => {
            console.log('⏰ Auction extended to:', data.newEndTime)
            setLocalEndsAt(new Date(data.newEndTime))
        })

        return () => {
            socket.emit('leave-auction', { auctionId: auction.id })
            socket.off('bid-accepted')
            socket.off('auction-extended')
        }
    }, [socket, auction.id])

    const handlePlaceBid = async (amountOverride?: number) => {
        if (!socket || !user) {
            alert("Please login to place a bid")
            return
        }

        const amountToBid = amountOverride || parseFloat(bidAmount)
        const minBid = currentBid + 100

        if (isNaN(amountToBid) || amountToBid < minBid) {
            alert(`Minimum bid: ETB ${minBid.toLocaleString()}`)
            return
        }

        setIsPlacingBid(true)

        try {
            // Use promise-based approach with timeout
            const bidPromise = new Promise((resolve, reject) => {
                socket.emit('place-bid', {
                    auctionId: auction.id,
                    amount: amountToBid,
                }, (response: any) => {
                    if (response?.error || response?.data?.error) {
                        reject(new Error(response?.error || response?.data?.error || 'Bid failed'))
                    } else {
                        resolve(response)
                    }
                })

                // Timeout after 5 seconds
                setTimeout(() => reject(new Error('Bid timeout - please try again')), 5000)
            })

            await bidPromise
            setBidAmount("") // Clear input on success
            console.log('✅ Bid placed successfully!')
        } catch (error: any) {
            console.error('❌ Bid error:', error.message)
            alert(`Bid failed: ${error.message}`)
        } finally {
            // ALWAYS reset loading state
            setIsPlacingBid(false)
        }
    }

    const quickBidIncrement = (increment: number) => {
        // Get current value from input field, or use current bid if input is empty
        const currentInputValue = bidAmount ? parseFloat(bidAmount) : currentBid
        const newAmount = currentInputValue + increment
        // Update input field - user can click multiple times to keep increasing
        setBidAmount(newAmount.toString())
    }

    const images = auction.imageUrl ? [auction.imageUrl] : ['/placeholder.svg']

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <AxumHeader />

            <main className="flex-grow w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
                {/* Left Column: Asset Showroom */}
                <section className="flex-1 flex flex-col gap-6 min-w-0">
                    {/* Breadcrumbs */}
                    <div className="flex flex-wrap gap-2 text-sm">
                        <a className="text-slate-500 dark:text-[#b6b1a0] hover:text-primary" href="/">Home</a>
                        <span className="text-slate-500 dark:text-[#b6b1a0]">/</span>
                        <a className="text-slate-500 dark:text-[#b6b1a0] hover:text-primary" href="/auctions">{auction.category}</a>
                        <span className="text-slate-500 dark:text-[#b6b1a0]">/</span>
                        <span className="text-slate-900 dark:text-white font-medium">{auction.title.en}</span>
                    </div>

                    {/* Page Heading */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                                {auction.title.en}
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-[#b6b1a0]">
                            <span className="flex items-center gap-1">
                                <Verified className="text-primary w-4 h-4" />
                                Listing #{auction.id.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {auction.location.en}
                            </span>
                        </div>
                    </div>

                    {/* Hero Gallery */}
                    <div className="relative group rounded-2xl overflow-hidden bg-gray-900 aspect-video shadow-2xl">
                        {/* Live Badge */}
                        {auction.isLive && (
                            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-bold text-white tracking-wide">LIVE AUCTION</span>
                            </div>
                        )}

                        {/* Main Image */}
                        <div
                            className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                            style={{ backgroundImage: `url('${images[currentImageIndex]}')` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>

                        {/* Gallery Controls */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button
                                    onClick={() => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)}
                                    className="p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-black transition-all backdrop-blur-sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
                                    className="p-2 rounded-full bg-black/40 text-white hover:bg-primary hover:text-black transition-all backdrop-blur-sm"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Details Tabs */}
                    <div className="mt-4">
                        <div className="border-b border-gray-200 dark:border-[#37342a] mb-6">
                            <div className="flex gap-8 overflow-x-auto">
                                {['overview', 'specs', 'documents', 'location', 'feedback'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === tab
                                            ? 'border-b-2 border-primary text-slate-900 dark:text-white'
                                            : 'text-slate-500 dark:text-[#b6b1a0] hover:text-slate-800 dark:hover:text-white'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600 dark:text-[#b6b1a0]">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">About this Asset</h3>
                                    <p className="leading-relaxed">{auction.description.en}</p>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Badge variant="outline" className="bg-gray-100 dark:bg-[#37342a]">
                                            Trust Score: {auction.trustScore}%
                                        </Badge>
                                        <Badge variant="outline" className="bg-gray-100 dark:bg-[#37342a]">
                                            {auction.bidCount} Bids
                                        </Badge>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-[#201d12] rounded-xl p-5 border border-gray-200 dark:border-[#37342a]">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Asset Valuation</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span>Starting Price</span>
                                            <span className="font-mono font-medium text-slate-900 dark:text-white">
                                                ETB {auction.startingBid?.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-sm text-muted-foreground">Current Bid</span>
                                            <span className="font-mono font-medium text-primary">
                                                ETB {currentBid?.toLocaleString()}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-emerald-400">
                                            <Verified className="w-4 h-4" />
                                            Verified Listing
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'specs' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Technical Specifications</h3>
                                <p className="text-slate-600 dark:text-[#b6b1a0]">
                                    {auction.detailedDescription?.en || "No detailed specifications available for this item."}
                                </p>
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Legal Documents & Attachments</h3>
                                {auction.attachments && auction.attachments.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {auction.attachments.map((doc: any, i: number) => (
                                            <div key={i} className="flex items-center p-4 bg-white dark:bg-[#201d12] border border-gray-200 dark:border-[#37342a] rounded-xl hover:border-primary transition-colors group">
                                                <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center mr-4">
                                                    <span className="text-red-500 font-bold text-xs">PDF</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                        {doc.name || `Document ${i + 1}`}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-[#b6b1a0]">
                                                        {doc.size || 'Unknown size'}
                                                    </p>
                                                </div>
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 dark:bg-[#2a261a] rounded-xl border border-dashed border-gray-300 dark:border-[#37342a]">
                                        <p className="text-slate-500 dark:text-[#b6b1a0]">No documents attached to this auction.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'location' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Location</h3>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-[#b6b1a0]">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span>{auction.location?.en || "Location not specified"}</span>
                                </div>
                                <div className="aspect-video w-full bg-gray-200 dark:bg-[#201d12] rounded-xl flex items-center justify-center">
                                    <p className="text-slate-500">Map View Placeholder</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'feedback' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ratings & Reviews</h3>
                                {/* Placeholder for feedback - in production, fetch from backend */}
                                <div className="text-center py-8 bg-gray-50 dark:bg-[#2a261a] rounded-xl border border-dashed border-gray-300 dark:border-[#37342a]">
                                    <p className="text-slate-500 dark:text-[#b6b1a0]">
                                        Ratings and reviews will appear here after the auction is completed.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Right Column: Trading Floor Sidebar */}
                <aside className="w-full lg:w-[420px] shrink-0 flex flex-col gap-6">
                    {/* Bid Status Card */}
                    <div className="bg-white dark:bg-[#201d12] rounded-xl p-6 shadow-xl border border-gray-200 dark:border-primary/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-[#b6b1a0]">Current Highest Bid</p>
                                <h2 className="text-4xl font-bold font-mono text-primary mt-1 tracking-tight">
                                    ETB {(currentBid / 1000000).toFixed(1)}M
                                </h2>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-500 dark:text-[#b6b1a0]">Ends In</p>
                                <div className="flex items-center gap-1 mt-1 text-slate-900 dark:text-white font-mono font-bold text-lg">
                                    {timeRemaining.split(':').map((part, i) => (
                                        <span key={i} className={`bg-gray-100 dark:bg-[#37342a] px-1.5 rounded ${i === 2 && parseInt(part) < 60 ? 'text-red-500' : ''}`}>
                                            {part}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Place Bid Section */}
                        {user && auction.isLive && (
                            <div className="space-y-4">
                                {/* Quick Actions */}
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => quickBidIncrement(100000)}
                                        className="font-mono"
                                    >
                                        +100k
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => quickBidIncrement(500000)}
                                        className="font-mono"
                                    >
                                        +500k
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => quickBidIncrement(1000000)}
                                        className="font-mono"
                                    >
                                        +1M
                                    </Button>
                                </div>

                                {/* Custom Input */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-slate-500 dark:text-[#b6b1a0] font-mono text-sm">ETB</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#171612] border border-gray-200 dark:border-[#37342a] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 font-mono"
                                        placeholder={(currentBid + 100000).toLocaleString()}
                                    />
                                </div>

                                <Button
                                    onClick={() => handlePlaceBid()}
                                    disabled={isPlacingBid}
                                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPlacingBid ? 'PLACING BID...' : 'PLACE BID'} <Gavel className="ml-2 w-5 h-5" />
                                </Button>

                                <p className="text-center text-xs text-slate-400 dark:text-gray-500">
                                    By placing a bid, you agree to the Terms of Service.
                                </p>
                            </div>
                        )}

                        {/* Pay Now Button (Winner Only) */}
                        {((timeRemaining === "ENDED" || auction.status === 'ended') && auction.winnerId === user?.id) && (
                            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-900/30">
                                <h3 className="font-bold text-green-800 dark:text-green-400 mb-2">🎉 You Won this Auction!</h3>
                                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                                    Please complete your payment within 24 hours to secure this item.
                                </p>
                                <Button
                                    onClick={() => window.location.href = `/payment/${auction.id}`}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-green-600/20"
                                >
                                    Pay Now (ETB {currentBid.toLocaleString()})
                                </Button>
                            </div>
                        )}

                        {/* Feedback Section (Winner Only, after proper criteria) */}
                        {auction.status === 'paid' && (auction.winnerId === user?.id || auction.seller.id === user?.id) && (
                            <div className="mt-4">
                                {!showFeedback ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFeedback(true)}
                                        className="w-full"
                                    >
                                        Leave Feedback
                                    </Button>
                                ) : (
                                    <FeedbackSection
                                        auctionId={auction.id}
                                        toUserId={user?.id === auction.winnerId ? auction.seller.id : auction.winnerId || ''}
                                        onFeedbackSubmitted={() => console.log("Feedback done")}
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Audit Log / History */}
                    <div className="flex-1 min-h-[300px] bg-white dark:bg-[#201d12] rounded-xl border border-gray-200 dark:border-[#37342a] flex flex-col overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 dark:border-[#37342a] bg-gray-50 dark:bg-[#2a261a] flex justify-between items-center">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                                <History className="text-primary w-4 h-4" />
                                Live Activity Log
                            </h3>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-[#b6b1a0]">
                                    {socket?.connected ? 'Connected' : 'Disconnected'}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs">
                            {bidHistory.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    No bids yet
                                </div>
                            ) : (
                                bidHistory.map((bid, index) => (
                                    <div
                                        key={index}
                                        className={`flex justify-between items-center p-3 rounded ${index === 0
                                            ? 'bg-primary/10 border-l-2 border-primary'
                                            : 'hover:bg-gray-50 dark:hover:bg-[#2a261a] transition-colors'
                                            }`}
                                    >
                                        <div>
                                            <span className={index === 0 ? 'text-primary font-bold' : 'text-slate-700 dark:text-gray-300 font-medium'}>
                                                {bid.amount.toLocaleString()}
                                            </span>
                                            <div className="text-[10px] text-slate-500 dark:text-[#b6b1a0] mt-0.5">
                                                {bid.bidder?.username || `Bidder #${bid.bidderId.substring(0, 4).toUpperCase()}`}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={index === 0 ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-gray-400'}>
                                                {new Date(bid.timestamp).toLocaleTimeString()}
                                            </div>
                                            {index === 0 && <div className="text-[10px] text-slate-400">Just now</div>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Payment Trust Signals */}
                    <div className="bg-gray-100 dark:bg-[#201d12]/50 rounded-xl p-4 border border-transparent dark:border-[#37342a]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">Secure Payments via</span>
                            <Lock className="text-slate-400 w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-4 opacity-80">
                            <div className="h-8 w-auto bg-white dark:bg-white rounded px-2 flex items-center justify-center">
                                <span className="text-green-600 font-black text-xs">Chapa</span>
                            </div>
                            <div className="h-8 w-auto bg-white dark:bg-white rounded px-2 flex items-center justify-center opacity-50">
                                <span className="text-blue-500 font-bold text-xs italic tracking-tighter">telebirr</span>
                                <span className="ml-1 text-[8px] text-gray-500">Soon</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div >
    )
}
