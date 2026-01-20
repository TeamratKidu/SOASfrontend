
import { useState, useCallback, useRef } from "react"
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Shield,
    Plus,
    TrendingUp,
    Package,
    DollarSign,
    Clock,
    Eye,
    Edit,
    CheckCircle,
    BarChart3,
    Star,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AxumHeader } from "@/components/axum-header"
import { Footer } from "@/components/footer"

import { auctionService } from "@/services/auction.service"
import { useEffect } from "react"
import { toast } from "sonner" // Assuming sonner is available based on App.tsx

// Helper type for auction stats
interface DashboardStats {
    activeListings: number
    totalSales: number
    totalRevenue: number
    avgTrustScore: number
}

interface NewAuctionForm {
    titleEn: string
    titleAm: string
    descriptionEn: string
    descriptionAm: string
    category: string
    startingBid: string
    duration: string
    locationEn: string
    locationAm: string
}

export function SellerDashboard() {
    const { t } = useTranslation()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("overview")
    const [showNewAuction, setShowNewAuction] = useState(false)
    const [formData, setFormData] = useState<NewAuctionForm>({
        titleEn: "",
        titleAm: "",
        descriptionEn: "",
        descriptionAm: "",
        category: "",
        startingBid: "",
        duration: "7",
        locationEn: "",
        locationAm: "",
    })

    // Basic role check - adapt as needed based on AuthContext
    if (!user) {
        navigate("/login");
        return null;
    }

    const [myAuctions, setMyAuctions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats>({
        activeListings: 0,
        totalSales: 0,
        totalRevenue: 0,
        avgTrustScore: 100 // Default
    })

    const lastFetchedRef = useRef(0)

    const fetchMyAuctions = useCallback(async (force = false) => {
        // Cache: 60 seconds
        if (!force && Date.now() - lastFetchedRef.current < 60000 && myAuctions.length > 0) {
            return;
        }

        try {
            setLoading(true)
            const data = await auctionService.getMyAuctions()
            setMyAuctions(data)

            // Calculate basic stats from local data for now
            const active = data.filter((a: any) => a.status === 'active').length
            const sold = data.filter((a: any) => a.status === 'paid').length
            const revenue = data
                .filter((a: any) => a.status === 'paid')
                .reduce((acc: number, curr: any) => acc + Number(curr.currentPrice), 0)

            setStats({
                activeListings: active,
                totalSales: sold,
                totalRevenue: revenue,
                avgTrustScore: 98 // Placeholder until backend support
            })
            lastFetchedRef.current = Date.now()
        } catch (error) {
            console.error("Failed to fetch seller auctions", error)
            toast.error(t("Failed to load your auctions"))
        } finally {
            setLoading(false)
        }
    }, [myAuctions.length, t])

    useEffect(() => {
        if (user?.id) {
            fetchMyAuctions()
        }
    }, [user?.id, fetchMyAuctions])

    const handleSubmitAuction = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await auctionService.create({
                title: JSON.stringify({ en: formData.titleEn, am: formData.titleAm }), // Storing bilingual title as JSON string if backend expects string, or adjust backend to expect object
                description: JSON.stringify({ en: formData.descriptionEn, am: formData.descriptionAm }),
                startingPrice: Number(formData.startingBid),
                endTime: new Date(Date.now() + Number(formData.duration) * 24 * 60 * 60 * 1000).toISOString(),
                category: formData.category,
            })

            toast.success(t("Auction created successfully!"))
            setShowNewAuction(false)
            fetchMyAuctions(true) // Refresh list

            // Reset form
            setFormData({
                titleEn: "",
                titleAm: "",
                descriptionEn: "",
                descriptionAm: "",
                category: "",
                startingBid: "",
                duration: "7",
                locationEn: "",
                locationAm: "",
            })
        } catch (error) {
            console.error("Failed to create auction", error)
            toast.error(t("Failed to create auction"))
        }
    }

    const formatETB = (amount: number) => {
        return new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(amount);
    }


    return (
        <div className="min-h-screen bg-background">
            <AxumHeader />
            <div className="mx-auto max-w-7xl px-4 py-6">
                {/* Seller Profile Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary">
                            <AvatarImage src={"/placeholder.svg"} alt={user?.name} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                {user?.name?.charAt(0) || "S"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-foreground">{user?.name}</h1>

                                <Badge variant="outline" className="gap-1 border-green-500/50 text-green-500">
                                    <Shield className="h-3 w-3" />
                                    {t("Verified")}
                                </Badge>

                            </div>
                            <p className="text-sm text-muted-foreground">{t("Seller Dashboard")}</p>
                            <div className="mt-1 flex items-center gap-1">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="text-sm font-medium">{stats.avgTrustScore}%</span>
                                <span className="text-xs text-muted-foreground">{t("Trust Score")}</span>
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => setShowNewAuction(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t("New Auction")}
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.activeListings}</p>
                                <p className="text-xs text-muted-foreground">{t("Active Listings")}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.totalSales}</p>
                                <p className="text-xs text-muted-foreground">{t("Successful Sales")}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                                <DollarSign className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{formatETB(stats.totalRevenue)}</p>
                                <p className="text-xs text-muted-foreground">{t("Total Revenue")}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.avgTrustScore}%</p>
                                <p className="text-xs text-muted-foreground">{t("Trust Score")}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
                        <TabsTrigger value="listings">{t("My Listings")}</TabsTrigger>
                        <TabsTrigger value="analytics">{t("Analytics")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Recent Activity */}
                            <Card className="p-6">
                                <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    {t("Recent Activity")}
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { type: "bid", text: t("New bid on Agricultural Land"), time: "5m ago" },
                                        {
                                            type: "view",
                                            text: t("50 views on Toyota Land Cruiser"),
                                            time: "1h ago",
                                        },
                                        { type: "sale", text: t("Office Furniture sold!"), time: "2h ago" },
                                        { type: "bid", text: t("New bid on Server Rack"), time: "3h ago" },
                                    ].map((activity, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0"
                                        >
                                            <span className="text-sm text-foreground">{activity.text}</span>
                                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="p-6">
                                <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    {t("This Month")}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t("Total Views")}</span>
                                        <span className="font-semibold text-foreground">1,247</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t("Total Bids Received")}</span>
                                        <span className="font-semibold text-foreground">89</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t("Conversion Rate")}</span>
                                        <span className="font-semibold text-green-500">67%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t("Avg. Bid Amount")}</span>
                                        <span className="font-semibold text-primary">{formatETB(2450000)}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="listings">
                        <div className="space-y-4">
                            {myAuctions.length === 0 && !loading && (
                                <div className="text-center py-8 text-muted-foreground">
                                    {t("No auctions found. Create your first listing!")}
                                </div>
                            )}
                            {myAuctions.map((auction) => (
                                <Card key={auction.id} className="p-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <img
                                            src={auction.imageUrl}
                                            alt={auction.title.en}
                                            className="w-full sm:w-32 h-24 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline">{auction.id}</Badge>
                                                        <Badge
                                                            variant={
                                                                auction.status === "active"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className={
                                                                auction.status === "active"
                                                                    ? "bg-green-500 text-white"
                                                                    : ""
                                                            }
                                                        >
                                                            {auction.status === "active" ? t("Live") : t("Ended")}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-medium text-foreground">{auction.title.en}</h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {auction.bidCount} {t("bids")} • {formatETB(auction.currentBid)}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <Card className="p-6">
                            <div className="text-center py-12">
                                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="font-semibold text-foreground mb-2">{t("Analytics Coming Soon")}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t("Detailed performance metrics will be available here")}
                                </p>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* New Auction Modal */}
            {showNewAuction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto w-full h-full bg-black/50 backdrop-blur-sm">
                    <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-background">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            {t("Create New Auction")}
                        </h2>

                        <form onSubmit={handleSubmitAuction} className="space-y-6">
                            {/* Title */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t("Title (English)")}</Label>
                                    <Input
                                        value={formData.titleEn}
                                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                        placeholder="Enter auction title"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t("Title (Amharic)")}</Label>
                                    <Input
                                        value={formData.titleAm}
                                        onChange={(e) => setFormData({ ...formData, titleAm: e.target.value })}
                                        placeholder="የጨረታ ርዕስ ያስገቡ"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t("Description (English)")}</Label>
                                    <Textarea
                                        value={formData.descriptionEn}
                                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                        placeholder="Describe your item"
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t("Description (Amharic)")}</Label>
                                    <Textarea
                                        value={formData.descriptionAm}
                                        onChange={(e) => setFormData({ ...formData, descriptionAm: e.target.value })}
                                        placeholder="ንብረትዎን ይግለጹ"
                                        rows={4}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Price & Duration */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t("Starting Bid (ETB)")}</Label>
                                    <Input
                                        type="number"
                                        value={formData.startingBid}
                                        onChange={(e) => setFormData({ ...formData, startingBid: e.target.value })}
                                        placeholder="1000000"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t("Duration (Days)")}</Label>
                                    <Select
                                        value={formData.duration}
                                        onValueChange={(value) => setFormData({ ...formData, duration: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3">3 {t("days")}</SelectItem>
                                            <SelectItem value="5">5 {t("days")}</SelectItem>
                                            <SelectItem value="7">7 {t("days")}</SelectItem>
                                            <SelectItem value="14">14 {t("days")}</SelectItem>
                                            <SelectItem value="30">30 {t("days")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* PDF/Document Upload */}
                            <div className="space-y-2">
                                <Label>{t("Supporting Documents (Optional)")}</Label>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Upload PDF documents (max 10MB, up to 3 files)
                                </p>
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        // Validate file size and count
                                        const validFiles = files.filter(f => f.size <= 10 * 1024 * 1024).slice(0, 3);
                                        if (validFiles.length < files.length) {
                                            toast.error(t("Some files were too large or exceeded the limit"));
                                        }
                                        // In a real implementation, you would upload these files
                                        // For now, just show the file names
                                        console.log("Selected files:", validFiles.map(f => f.name));
                                    }}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground italic">
                                    {t("Supported formats: PDF, DOC, DOCX")}
                                </p>
                            </div>


                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 bg-transparent"
                                    onClick={() => setShowNewAuction(false)}
                                >
                                    {t("Cancel")}
                                </Button>
                                <Button type="submit" className="flex-1">
                                    {t("Submit for Review")}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
            <Footer />
        </div>
    )
}
