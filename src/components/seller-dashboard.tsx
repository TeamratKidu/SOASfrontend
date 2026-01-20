"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { formatETB, categoryDetails, type Auction, type AuctionCategory } from "@/lib/auction-data"
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
    Trash2,
    Upload,
    CheckCircle,
    BarChart3,
    Star,
    ShieldAlert,
} from "lucide-react"
import { AxumHeader } from "@/components/axum-header"
import { useNavigate } from "react-router-dom"
import { uploadService } from "@/services/upload.service"
import { auctionService, type CreateAuctionDto } from "@/services/auction.service"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/empty-state"

interface NewAuctionForm {
    titleEn: string
    titleAm: string
    descriptionEn: string
    descriptionAm: string
    category: AuctionCategory | ""
    startingBid: string
    duration: string
    locationEn: string
    locationAm: string
}

export function SellerDashboard() {
    const { lang, t } = useLanguage()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("overview")
    const [showNewAuction, setShowNewAuction] = useState(false)
    const [sellerAuctions, setSellerAuctions] = useState<Auction[]>([])
    // const [loading, setLoading] = useState(true) // TODO: Add loading state UI

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

    useEffect(() => {
        if (!user) return;

        const fetchMyAuctions = async () => {
            try {
                // setLoading(true)
                const auctions = await auctionService.getMyAuctions()
                setSellerAuctions(auctions)
            } catch (error) {
                console.error("Failed to fetch seller auctions:", error)
            } finally {
                // setLoading(false)
            }
        }

        fetchMyAuctions()
    }, [user])

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <AxumHeader />
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 mb-4">
                        <ShieldAlert className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground mb-2">{t("Sign In Required", "መግባት ያስፈልጋል")}</h1>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                        {t("Please sign in to access your seller dashboard.", "የሻጭ ዳሽቦርድዎን ለመድረስ እባክዎ ይግቡ።")}
                    </p>
                    <Button onClick={() => navigate("/signin")}>{t("Sign In", "ግባ")}</Button>
                </div>
            </div>
        )
    }

    if (user.role !== "seller" && user.role !== "admin") {
        return (
            <div className="min-h-screen bg-background">
                <AxumHeader />
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/20 mb-4">
                        <ShieldAlert className="h-8 w-8 text-destructive" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground mb-2">{t("Seller Access Required", "የሻጭ መዳረሻ ያስፈልጋል")}</h1>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                        {t(
                            "You need to be a verified seller to access this dashboard. Upgrade your account to start listing auctions.",
                            "ይህን ዳሽቦርድ ለመድረስ የተረጋገጠ ሻጭ መሆን ያስፈልግዎታል። ጨረታዎችን መዝገብ ለመጀመር መለያዎን ያሻሽሉ።",
                        )}
                    </p>
                    <Button onClick={() => navigate("/become-seller")}>{t("Become a Seller", "ሻጭ ይሁኑ")}</Button>
                </div>
            </div>
        )
    }

    // Real stats based on fetched auctions
    const stats = {
        activeListings: sellerAuctions.filter((a) => a.status === "active").length,
        totalSales: sellerAuctions.filter((a) => a.status === "ended" && a.winnerId).length,
        // Calculate revenue from ended auctions that have a winner
        totalRevenue: sellerAuctions
            .filter((a) => a.status === "ended" && a.winnerId)
            .reduce((sum, a) => sum + (a.currentBid || 0), 0),
        avgTrustScore: user?.trustScore || 0,
    }

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (file.size > 10 * 1024 * 1024) {
                toast.error(t("File too large. Max 10MB.", "ፋይል በጣም ትልቅ ነው። ከፍተኛ 10MB።"))
                return
            }
            setSelectedFile(file)
        }
    }

    const handleSubmitAuction = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)

            let imageUrl = "/placeholder.svg" // Default fallback
            let isImage = true;

            // 1. Upload Image if selected
            if (selectedFile) {
                isImage = selectedFile.type.startsWith('image/');
                try {
                    setUploading(true)
                    const uploadRes = await uploadService.uploadFile(selectedFile)
                    // If backend returns relative path /uploads/images/..., prepend backend URL if needed
                    // For now assuming backend serves static files correctly at root or relative
                    imageUrl = uploadRes.path
                } catch (err) {
                    toast.error(t("Failed to upload image", "ምስል መስቀል አልተሳካም"))
                    console.error(err)
                    setIsSubmitting(false)
                    setUploading(false)
                    return
                } finally {
                    setUploading(false)
                }
            }

            // 2. Prepare Auction DTO
            // Map frontend form data to backend expected DTO
            const auctionData: CreateAuctionDto & { attachments: any[] } = {
                title: formData.titleEn,
                description: formData.descriptionEn,
                startingPrice: parseFloat(formData.startingBid),
                minimumIncrement: parseFloat(formData.startingBid) * 0.05,
                endTime: new Date(Date.now() + parseInt(formData.duration) * 24 * 60 * 60 * 1000).toISOString(),
                imageUrls: isImage ? [imageUrl] : [],
                attachments: !isImage && selectedFile ? [{
                    name: selectedFile.name,
                    type: 'pdf',
                    url: imageUrl,
                    size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB'
                }] : [],
                category: formData.category || 'other',
            }

            // 3. Create Auction
            const newAuction = await auctionService.create(auctionData)
            setSellerAuctions([newAuction, ...sellerAuctions])

            toast.success(t("Auction submitted successfully!", "ጨረታው በተሳካ ሁኔታ ቀርቧል!"))
            setShowNewAuction(false)
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
            setSelectedFile(null)

            // Optionally refresh list
            // queryClient.invalidateQueries(['my-auctions'])
        } catch (error) {
            console.error("Failed to create auction", error)
            toast.error(t("Failed to create auction", "ጨረታ መፍጠር አልተሳካም"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <AxumHeader />

            <div className="mx-auto max-w-7xl px-4 py-6">
                {/* Seller Profile Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary">
                            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xl">
                                {user?.name?.charAt(0) || "S"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-foreground">{user?.name}</h1>
                                {user?.verified && (
                                    <Badge variant="outline" className="gap-1 border-trust-green/50 text-trust-green">
                                        <Shield className="h-3 w-3" />
                                        {t("Verified", "የተረጋገጠ")}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{t("Seller Dashboard", "የሻጭ ዳሽቦርድ")}</p>
                            <div className="mt-1 flex items-center gap-1">
                                <Star className="h-4 w-4 fill-primary text-primary" />
                                <span className="text-sm font-medium">{user?.trustScore}%</span>
                                <span className="text-xs text-muted-foreground">{t("Trust Score", "የእምነት ነጥብ")}</span>
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => setShowNewAuction(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t("New Auction", "አዲስ ጨረታ")}
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
                                <p className="text-xs text-muted-foreground">{t("Active Listings", "ንቁ ዝርዝሮች")}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-trust-green/20">
                                <CheckCircle className="h-5 w-5 text-trust-green" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.totalSales}</p>
                                <p className="text-xs text-muted-foreground">{t("Successful Sales", "የተሳኩ ሽያጮች")}</p>
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
                                <p className="text-xs text-muted-foreground">{t("Total Revenue", "ጠቅላላ ገቢ")} (ETB)</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-trust-green/20">
                                <TrendingUp className="h-5 w-5 text-trust-green" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stats.avgTrustScore}%</p>
                                <p className="text-xs text-muted-foreground">{t("Trust Score", "የእምነት ነጥብ")}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="overview">{t("Overview", "አጠቃላይ እይታ")}</TabsTrigger>
                        <TabsTrigger value="listings">{t("My Listings", "ዝርዝሮቼ")}</TabsTrigger>
                        <TabsTrigger value="analytics">{t("Analytics", "ትንታኔ")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Recent Activity */}
                            <Card className="p-6">
                                <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    {t("Recent Activity", "የቅርብ ጊዜ እንቅስቃሴ")}
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { type: "bid", text: t("New bid on Agricultural Land", "በእርሻ መሬት ላይ አዲስ ጨረታ"), time: "5m ago" },
                                        {
                                            type: "view",
                                            text: t("50 views on Toyota Land Cruiser", "ቶዮታ ላንድ ክሩዘር 50 እይታዎች"),
                                            time: "1h ago",
                                        },
                                        { type: "sale", text: t("Office Furniture sold!", "የቢሮ ዕቃዎች ተሸጡ!"), time: "2h ago" },
                                        { type: "bid", text: t("New bid on Server Rack", "በሰርቨር ራክ ላይ አዲስ ጨረታ"), time: "3h ago" },
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
                                    {t("This Month", "በዚህ ወር")}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t("Total Views", "ጠቅላላ እይታዎች")}</span>
                                        <span className="font-semibold text-foreground">1,247</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t("Total Bids Received", "የተቀበሉ ጨረታዎች")}</span>
                                        <span className="font-semibold text-foreground">89</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t("Conversion Rate", "የልወጣ መጠን")}</span>
                                        <span className="font-semibold text-trust-green">67%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">{t("Avg. Bid Amount", "አማካኝ የጨረታ መጠን")}</span>
                                        <span className="font-semibold text-primary">{formatETB(2450000)} ETB</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="listings">
                        <div className="space-y-4">
                            {sellerAuctions.length === 0 ? (
                                <EmptyState
                                    icon={Package}
                                    title={t("No listed auctions", "ምንም የተዘረዘሩ ጨረታዎች የልም")}
                                    description={t("You haven't listed any items for auction yet.", "እስካሁን ለጨረታ ምንም ዕቃ አልዘረዘሩም።")}
                                    action={{
                                        label: t("Create New Auction", "አዲስ ጨረታ ይፍጠሩ"),
                                        onClick: () => setShowNewAuction(true)
                                    }}
                                />
                            ) : (
                                sellerAuctions.map((auction) => (
                                    <Card key={auction.id} className="p-4">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <img
                                                src={auction.imageUrl || "/placeholder.svg"}
                                                alt={auction.title[lang]}
                                                className="w-full sm:w-32 h-24 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge variant="outline">{auction.id.substring(0, 8)}...</Badge>
                                                            <Badge
                                                                variant={
                                                                    auction.status === "active"
                                                                        ? "default"
                                                                        : auction.status === "ended"
                                                                            ? "secondary"
                                                                            : auction.status === "pending"
                                                                                ? "outline"
                                                                                : "outline"
                                                                }
                                                                className={
                                                                    auction.status === "active"
                                                                        ? "bg-trust-green text-white"
                                                                        : auction.status === "pending"
                                                                            ? "border-primary/50 text-primary"
                                                                            : ""
                                                                }
                                                            >
                                                                {auction.status === "active"
                                                                    ? t("Live", "ቀጥታ")
                                                                    : auction.status === "ended"
                                                                        ? t("Ended", "አልቋል")
                                                                        : auction.status === "pending"
                                                                            ? t("Pending", "በመጠባበቅ ላይ")
                                                                            : t("Draft", "ረቂቅ")}
                                                            </Badge>
                                                        </div>
                                                        <h3 className="font-medium text-foreground">{auction.title[lang]}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {auction.bidCount} {t("bids", "ጨረታዎች")} • {formatETB(auction.currentBid)} ETB
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        {auction.status === "draft" && (
                                                            <Button variant="ghost" size="icon" className="text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <Card className="p-6">
                            <div className="text-center py-12">
                                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="font-semibold text-foreground mb-2">{t("Analytics Coming Soon", "ትንታኔ በቅርብ ይመጣል")}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t("Detailed performance metrics will be available here", "ዝርዝር የአፈጻጸም መለኪያዎች እዚህ ይገኛሉ")}
                                </p>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* New Auction Modal */}
            {showNewAuction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setShowNewAuction(false)}
                    />
                    <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            {t("Create New Auction", "አዲስ ጨረታ ይፍጠሩ")}
                        </h2>

                        <form onSubmit={handleSubmitAuction} className="space-y-6">
                            {/* Title */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t("Title (English)", "ርዕስ (እንግሊዝኛ)")}</Label>
                                    <Input
                                        value={formData.titleEn}
                                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                        placeholder="Enter auction title"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t("Title (Amharic)", "ርዕስ (አማርኛ)")}</Label>
                                    <Input
                                        value={formData.titleAm}
                                        onChange={(e) => setFormData({ ...formData, titleAm: e.target.value })}
                                        placeholder="የጨረታ ርዕስ ያስገቡ"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label>{t("Category", "ምድብ")}</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value as AuctionCategory })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("Select category", "ምድብ ይምረጡ")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(categoryDetails).map(([key, cat]) => (
                                            <SelectItem key={key} value={key}>
                                                {cat.label[lang]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Description */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t("Description (English)", "መግለጫ (እንግሊዝኛ)")}</Label>
                                    <Textarea
                                        value={formData.descriptionEn}
                                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                        placeholder="Describe your item"
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t("Description (Amharic)", "መግለጫ (አማርኛ)")}</Label>
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
                                    <Label>{t("Starting Bid (ETB)", "የመነሻ ጨረታ (ብር)")}</Label>
                                    <Input
                                        type="number"
                                        value={formData.startingBid}
                                        onChange={(e) => setFormData({ ...formData, startingBid: e.target.value })}
                                        placeholder="1000000"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t("Duration (Days)", "ቆይታ (ቀናት)")}</Label>
                                    <Select
                                        value={formData.duration}
                                        onValueChange={(value) => setFormData({ ...formData, duration: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3">3 {t("days", "ቀናት")}</SelectItem>
                                            <SelectItem value="5">5 {t("days", "ቀናት")}</SelectItem>
                                            <SelectItem value="7">7 {t("days", "ቀናት")}</SelectItem>
                                            <SelectItem value="14">14 {t("days", "ቀናት")}</SelectItem>
                                            <SelectItem value="30">30 {t("days", "ቀናት")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t("Location (English)", "ቦታ (እንግሊዝኛ)")}</Label>
                                    <Input
                                        value={formData.locationEn}
                                        onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                                        placeholder="Addis Ababa"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t("Location (Amharic)", "ቦታ (አማርኛ)")}</Label>
                                    <Input
                                        value={formData.locationAm}
                                        onChange={(e) => setFormData({ ...formData, locationAm: e.target.value })}
                                        placeholder="አዲስ አበባ"
                                        required
                                    />
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <Label>{t("Attachments (Image or PDF)", "አባሪዎች (ምስል ወይም ፒዲኤፍ)")}</Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                    {selectedFile ? (
                                        <p className="text-sm font-medium text-primary">
                                            {selectedFile.name}
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-sm text-muted-foreground">
                                                {t("Drag & drop files or click to upload", "ፋይሎችን ይጎትቱ ወይም ለመስቀል ጠቅ ያድርጉ")}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {t("Images or PDF up to 10MB", "ምስሎች ወይም ፒዲኤፍ እስከ 10MB")}
                                            </p>
                                        </>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="mt-3"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 bg-transparent"
                                    onClick={() => setShowNewAuction(false)}
                                    disabled={isSubmitting}
                                >
                                    {t("Cancel", "ሰርዝ")}
                                </Button>
                                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                    {isSubmitting ? (uploading ? t("Uploading...", "በመስቀል ላይ...") : t("Submitting...", "በማቅረብ ላይ...")) : t("Submit for Review", "ለግምገማ አቅርብ")}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    )
}
