"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { formatETB, type Auction } from "@/lib/auction-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Shield,
    AlertTriangle,
    Ban,
    CheckCircle,
    Clock,
    FileText,
    TrendingUp,
    Gavel,
    RefreshCw,
    MoreVertical,
    Eye,
    XCircle,
    Users,
} from "lucide-react"
import { useState, useCallback } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AxumHeader } from "@/components/axum-header"
import { Footer } from "@/components/footer"
import { adminService, type AuditLog } from "@/services/admin.service"
import { auctionService } from "@/services/auction.service"
import { toast } from "sonner"
import { useEffect } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"

export function AdminDashboard() {
    const { lang, t } = useLanguage()
    const { user } = useAuth()

    const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
    const [cancelReason, setCancelReason] = useState("")
    const [showCancelModal, setShowCancelModal] = useState(false)

    // Real Data State
    const [liveAuctions, setLiveAuctions] = useState<any[]>([])
    const [pendingAuctions, setPendingAuctions] = useState<any[]>([]) // Added pending auctions state
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
    const [userCount, setUserCount] = useState(0)
    const [totalBids, setTotalBids] = useState(0)
    const [loading, setLoading] = useState(true)

    const [pendingSellers, setPendingSellers] = useState<any[]>([])

    const [lastFetched, setLastFetched] = useState(0)

    const fetchDashboardData = useCallback(async (force = false) => {
        // Cache check: 60 seconds
        if (!force && Date.now() - lastFetched < 60000 && liveAuctions.length > 0) {
            return;
        }

        try {
            setLoading(true)

            // 1. Fetch Active Auctions
            const auctionsRes = await auctionService.getAll({ status: 'active', limit: 20 })
            setLiveAuctions(auctionsRes.data || [])

            // 1.1 Fetch Pending Auctions
            const pendingAuctionsRes = await auctionService.getAll({ status: 'pending', limit: 20 })
            setPendingAuctions(pendingAuctionsRes.data || [])

            // 2. Fetch Users Count - with error handling
            try {
                const users = await adminService.getAllUsers()
                setUserCount(users.length)
            } catch (err) {
                console.warn("Failed to fetch users count", err)
                // Don't fail the whole dashboard
            }

            // 3. Fetch Audit Logs - with error handling
            try {
                const logs = await adminService.getAuditLogs({ limit: 10 } as any)
                setAuditLogs(logs || [])
            } catch (err) {
                console.warn("Failed to fetch audit logs", err)
            }

            // 4. Fetch Pending Sellers
            try {
                const sellersRes = await adminService.getPendingSellers()
                const sellers = Array.isArray(sellersRes) ? sellersRes : (sellersRes as any).data || []
                setPendingSellers(sellers)
            } catch (err) {
                console.warn("Failed to fetch pending sellers", err)
            }

            // 5. Calculate total bids
            const bids = auctionsRes.data?.reduce((acc: number, curr: any) => acc + (curr.bidCount || 0), 0) || 0
            setTotalBids(bids)

            setLastFetched(Date.now())

        } catch (error) {
            console.error("Failed to fetch admin data", error)
            toast.error("Failed to load dashboard data fully")
        } finally {
            setLoading(false)
        }
    }, [lastFetched, liveAuctions.length])

    useEffect(() => {
        if (user?.role === "admin") {
            fetchDashboardData()
        }
    }, [user, fetchDashboardData])

    const handleApproveSeller = async (userId: string) => {
        try {
            await adminService.approveSeller(userId)
            toast.success("Seller approved successfully")
            fetchDashboardData()
        } catch (error) {
            toast.error("Failed to approve seller")
        }
    }

    const handleRejectSeller = async (userId: string) => {
        const reason = prompt("Enter rejection reason:")
        if (reason) {
            try {
                await adminService.rejectSeller(userId, reason)
                toast.success("Seller rejected")
                fetchDashboardData()
            } catch (error) {
                toast.error("Failed to reject seller")
            }
        }
    }

    const handleBlockUser = async (userId: string) => {
        if (confirm(t(`Are you sure you want to block user ${userId}?`, `እርግጠኛ ነዎት ተጠቃሚ ${userId} ማገድ ይፈልጋሉ?`))) {
            try {
                await adminService.blockUser(userId, "Admin manual block")
                toast.success(t("User blocked successfully", "ተጠቃሚው በተሳካ ሁኔታ ታግዷል"))
                fetchDashboardData() // Refresh
            } catch (error) {
                toast.error(t("Failed to block user", "ተጠቃሚን ማገድ አልተቻለም"))
            }
        }
    }

    const handleCancelAuction = async () => {
        if (selectedAuction && cancelReason) {
            try {
                await auctionService.cancel(selectedAuction.id)
                toast.success(t(`Auction ${selectedAuction.id} cancelled.`, `ጨረታ ${selectedAuction.id} ተሰርዟል።`))
                setShowCancelModal(false)
                setCancelReason("")
                setSelectedAuction(null)
                fetchDashboardData()
            } catch (error) {
                toast.error(t("Failed to cancel auction", "ጨረታ መሰረዝ አልተቻለም"))
            }
        }
    }

    const handleApproveAuction = async (id: string) => {
        try {
            await auctionService.approve(id)
            toast.success("Auction approved and is now live")
            fetchDashboardData()
        } catch (error) {
            toast.error("Failed to approve auction")
        }
    }

    const handleRejectAuction = async (id: string) => {
        // For now using cancel or we could have a specific reject logic.
        // Assuming cancelling a pending auction rejects it.
        if (confirm("Are you sure you want to reject this auction?")) {
            try {
                await auctionService.cancel(id)
                toast.success("Auction rejected")
                fetchDashboardData()
            } catch (error) {
                toast.error("Failed to reject auction")
            }
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <AxumHeader />

            {/* Header */}
            <div className="border-b border-border/50 bg-imperial/50 px-4 py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <Shield className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-foreground">{t("Admin Command Center", "የአስተዳዳሪ ትዕዛዝ ማዕከል")}</h1>
                                <p className="text-xs text-muted-foreground">
                                    {t("System Monitoring & Control", "የስርዓት ክትትል እና ቁጥጥር")}
                                </p>
                            </div>
                        </div>

                        <Badge variant="outline" className="gap-1 border-trust-green/50 text-trust-green">
                            <CheckCircle className="h-3 w-3" />
                            {t("System Healthy", "ስርዓቱ ጤናማ ነው")}
                        </Badge>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <SkeletonLoader count={1} type="card" className="h-24" />
                        <SkeletonLoader count={1} type="card" className="h-24" />
                        <SkeletonLoader count={1} type="card" className="h-24" />
                        <SkeletonLoader count={1} type="card" className="h-24" />
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <SkeletonLoader count={3} type="row" />
                        <SkeletonLoader count={3} type="row" />
                    </div>
                </div>
            )}

            {!loading && (
                <div className="mx-auto max-w-7xl px-4 py-6">
                    {/* Stats Grid */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* ... existing stats cards ... */}
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                                    <Gavel className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{liveAuctions.length}</p>
                                    <p className="text-xs text-muted-foreground">{t("Live Auctions", "ቀጥታ ጨረታዎች")}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-trust-green/20">
                                    <TrendingUp className="h-5 w-5 text-trust-green" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{totalBids}</p>
                                    <p className="text-xs text-muted-foreground">{t("Total Bids", "ጠቅላላ ጨረታዎች")}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-imperial-light">
                                    <Users className="h-5 w-5 text-foreground" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{userCount}</p>
                                    <p className="text-xs text-muted-foreground">{t("Active Users", "ንቁ ተጠቃሚዎች")}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-destructive">{auditLogs.length}</p>
                                    <p className="text-xs text-muted-foreground">{t("Recent Audit Logs", "የቅርብ ኦዲት መዝገቦች")}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Pending Seller Approvals */}
                        <div className="lg:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 font-semibold text-foreground">
                                    <CheckCircle className="h-5 w-5 text-trust-green" />
                                    {t("Pending Seller Approvals", "በመጠባበቅ ላይ ያሉ የሻጭ ፈቃዶች")}
                                </h2>
                            </div>

                            {pendingSellers.length === 0 ? (
                                <EmptyState
                                    icon={CheckCircle}
                                    title={t("No pending requests", "ምንም በመጠባበቅ ላይ ያሉ ጥያቄዎች የሉም")}
                                    description={t("All seller upgrades have been processed.", "ሁሉም የሻጭ ማሻሻያዎች ተስተናግደዋል")}
                                    className="py-8 border-dashed"
                                />
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {pendingSellers.map((seller) => (
                                        <Card key={seller.id} className="p-4 flex flex-col gap-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    {seller.image ? (
                                                        <img src={seller.image} alt={seller.name} className="h-10 w-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                            <Users className="h-5 w-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-foreground">{seller.name}</p>
                                                        <p className="text-xs text-muted-foreground">{seller.email}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50">Pending</Badge>
                                            </div>

                                            <div className="space-y-1 text-sm bg-muted/30 p-2 rounded-md">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">TIN:</span>
                                                    <span className="font-medium font-mono">{seller.tinNumber || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Fayda ID:</span>
                                                    <span className="font-medium font-mono">{seller.faydaId || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Location:</span>
                                                    <span className="font-medium">{seller.location || "N/A"}</span>
                                                </div>
                                            </div>

                                            {seller.bio && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 italic">"{seller.bio}"</p>
                                            )}

                                            <div className="flex gap-2 mt-auto pt-2">
                                                <Button
                                                    className="flex-1 bg-trust-green hover:bg-green-700"
                                                    size="sm"
                                                    onClick={() => handleApproveSeller(seller.id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 text-destructive hover:bg-destructive/10"
                                                    size="sm"
                                                    onClick={() => handleRejectSeller(seller.id)}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pending Auction Approvals */}
                        <div className="lg:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 font-semibold text-foreground">
                                    <Clock className="h-5 w-5 text-orange-500" />
                                    {t("Pending Auction Approvals", "በመጠባበቅ ላይ ያሉ የጨረታ ፈቃዶች")}
                                </h2>
                            </div>

                            {pendingAuctions.length === 0 ? (
                                <EmptyState
                                    icon={Clock}
                                    title={t("No pending auctions", "ምንም በመጠባበቅ ላይ ያሉ ጨረታዎች የሉም")}
                                    description={t("All auction requests have been processed.", "ሁሉም የጨረታ ጥያቄዎች ተስተናግደዋል")}
                                    className="py-8 border-dashed"
                                />
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {pendingAuctions.map((auction) => (
                                        <Card key={auction.id} className="p-4 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="outline" className="text-orange-500 bg-orange-50 mb-2">Pending</Badge>
                                                <span className="text-xs text-muted-foreground font-mono">{auction.id}</span>
                                            </div>

                                            <h3 className="font-semibold text-foreground line-clamp-1" title={auction.title[lang]}>{auction.title[lang]}</h3>

                                            <div className="space-y-1 text-sm bg-muted/30 p-2 rounded-md">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Start Price:</span>
                                                    <span className="font-medium font-mono text-primary">{formatETB(auction.startingBid)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Seller:</span>
                                                    <span className="font-medium">{auction.seller?.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Category:</span>
                                                    <span className="font-medium">{auction.category}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-auto pt-2">
                                                <Button
                                                    className="flex-1 bg-trust-green hover:bg-green-700"
                                                    size="sm"
                                                    onClick={() => handleApproveAuction(auction.id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 text-destructive hover:bg-destructive/10"
                                                    size="sm"
                                                    onClick={() => handleRejectAuction(auction.id)}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {/* View Details */ }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Flagged Activities */}
                        <div>
                            {/* ... audit logs code ... */}
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 font-semibold text-foreground">
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                    {t("Recent Audit Logs", "የቅርብ ኦዲት መዝገቦች")}
                                </h2>
                                <Button variant="outline" size="sm" onClick={() => fetchDashboardData(true)}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    {t("Refresh", "አድስ")}
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {auditLogs.length === 0 ? (
                                    <EmptyState
                                        icon={AlertTriangle}
                                        title={t("No recent logs", "ምንም የቅርብ መዝገቦች የሉም")}
                                        description={t("System activities will appear here.", "የስርዓት እንቅስቃሴዎች እዚህ ይታያሉ።")}
                                        className="py-8"
                                    />
                                ) : (
                                    auditLogs.map((log) => (
                                        <Card
                                            key={log.id}
                                            className={`p-4`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className={`mt-0.5 h-3 w-3 rounded-full bg-blue-500`}
                                                    />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-foreground">{log.action}</span>
                                                            <Badge variant="outline" className="text-[10px]">
                                                                {log.userId || "System"}
                                                            </Badge>
                                                        </div>
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Entity: {log.entityId} | IP: {log.ipAddress}
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {new Date(log.timestamp).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {log.userId && (
                                                            <DropdownMenuItem onClick={() => handleBlockUser(log.userId!)}>
                                                                <Ban className="mr-2 h-4 w-4" />
                                                                {t("Block User", "ተጠቃሚ አግድ")}
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Live Auctions Control */}
                        <div>
                            {/* ... live auctions code ... */}
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 font-semibold text-foreground">
                                    <Gavel className="h-5 w-5 text-primary" />
                                    {t("Live Auctions", "ቀጥታ ጨረታዎች")}
                                </h2>
                                {/* ... filters ... */}
                            </div>
                            <div className="space-y-3">
                                {liveAuctions.length === 0 ? (
                                    <EmptyState
                                        icon={Gavel}
                                        title={t("No live auctions", "ምንም ቀጥታ ጨረታዎች የሉም")}
                                        description={t("Active auctions will appear here.", "ንቁ ጨረታዎች እዚህ ይታያሉ።")}
                                        className="py-8"
                                    />
                                ) : (
                                    liveAuctions.map((auction) => (
                                        <Card key={auction.id} className="p-4">
                                            {/* ... auction card details ... */}
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="live-indicator h-2 w-2 rounded-full bg-red-500" />
                                                        <Badge variant="outline">{auction.id}</Badge>
                                                        <Badge variant="secondary" className="gap-1">
                                                            <Shield className="h-3 w-3" />
                                                            {auction.trustScore}%
                                                        </Badge>
                                                    </div>
                                                    <h3 className="mt-2 font-medium text-foreground line-clamp-1">{auction.title[lang]}</h3>
                                                    <div className="mt-2 flex items-center gap-4 text-sm">
                                                        <span className="text-primary font-semibold">{formatETB(auction.currentBid)} ETB</span>
                                                        <span className="text-muted-foreground">
                                                            {auction.bidCount} {t("bids", "ጨረታዎች")}
                                                        </span>
                                                    </div>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            {t("View Auction", "ጨረታ ይመልከቱ")}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            {t("View Audit Log", "የኦዲት መዝገብ ይመልከቱ")}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => {
                                                                setSelectedAuction(auction)
                                                                setShowCancelModal(true)
                                                            }}
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            {t("Cancel Auction", "ጨረታ ሰርዝ")}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Auction Modal */}
            {showCancelModal && selectedAuction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setShowCancelModal(false)}
                    />
                    <Card className="relative max-w-md w-full p-6">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-destructive">
                            <XCircle className="h-5 w-5" />
                            {t("Cancel Auction", "ጨረታ ሰርዝ")}
                        </h3>

                        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 p-3">
                            <p className="text-sm text-destructive">
                                {t(
                                    "This action is irreversible and will be logged in the audit trail.",
                                    "ይህ ድርጊት የማይቀለበስ ሲሆን በኦዲት ዱካ ውስጥ ይመዘገባል።",
                                )}
                            </p>
                        </div>

                        <div className="mb-4">
                            <p className="mb-2 text-sm text-muted-foreground">
                                {t("Auction", "ጨረታ")}: <span className="font-medium text-foreground">{selectedAuction.id}</span>
                            </p>
                            <p className="text-sm text-foreground">{selectedAuction.title[lang]}</p>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                {t("Cancellation Reason (Required)", "የሰረዛ ምክንያት (አስፈላጊ)")}
                            </label>
                            <Input
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder={t("Enter detailed reason...", "ዝርዝር ምክንያት ያስገቡ...")}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowCancelModal(false)}>
                                {t("Go Back", "ተመለስ")}
                            </Button>
                            <Button variant="destructive" className="flex-1" onClick={handleCancelAuction} disabled={!cancelReason}>
                                {t("Confirm Cancel", "ሰርዝ አረጋግጥ")}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
            <Footer />
        </div>
    )
}
