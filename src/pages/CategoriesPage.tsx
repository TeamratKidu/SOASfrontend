import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useLanguage } from "@/contexts/LanguageContext"
import { categoryDetails, type AuctionCategory, formatETB } from "@/lib/auction-data"
import { auctionService } from "@/services/auction.service"
import { AxumHeader } from "@/components/axum-header"
import { AuctionCard } from "@/components/auction-card"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Search,
    Filter,
    X,
    Building,
    Car,
    Heart,
    Cog,
    Monitor,
    Armchair,
    Factory,
    Wheat,
    SlidersHorizontal,
} from "lucide-react"

const iconMap = {
    Building,
    Car,
    Heart,
    Cog,
    Monitor,
    Sofa: Armchair,
    Factory,
    Wheat,
}

export default function CategoriesPage() {
    const { lang, t } = useLanguage()
    const [searchParams] = useSearchParams()
    const initialCategory = searchParams.get("category") as AuctionCategory | null

    const [selectedCategories, setSelectedCategories] = useState<AuctionCategory[]>(
        initialCategory ? [initialCategory] : [],
    )
    const [searchQuery, setSearchQuery] = useState("")
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000])
    const [sortBy, setSortBy] = useState("ending-soon")
    const [showFilters, setShowFilters] = useState(false)
    const [liveOnly, setLiveOnly] = useState(false)

    // Data fetching
    const [auctions, setAuctions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true)
                const response = await auctionService.getAll({ limit: 100 }) // Fetch more for client side filtering
                setAuctions(response.data || [])
            } catch (error) {
                console.error("Failed to fetch auctions", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAuctions()
    }, [])

    useEffect(() => {
        if (initialCategory) {
            setSelectedCategories([initialCategory])
        }
    }, [initialCategory])


    const toggleCategory = (category: AuctionCategory) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
        )
    }

    const filteredAuctions = auctions
        .filter((auction) => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(auction.category)
            const matchesSearch =
                searchQuery === "" ||
                auction.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                auction.location[lang].toLowerCase().includes(searchQuery.toLowerCase())
            const matchesPrice = auction.currentBid >= priceRange[0] && auction.currentBid <= priceRange[1]
            const matchesLive = !liveOnly || auction.isLive
            return matchesCategory && matchesSearch && matchesPrice && matchesLive
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "ending-soon":
                    return a.endsAt.getTime() - b.endsAt.getTime()
                case "price-low":
                    return a.currentBid - b.currentBid
                case "price-high":
                    return b.currentBid - a.currentBid
                case "most-bids":
                    return b.bidCount - a.bidCount
                default:
                    return 0
            }
        })

    const clearFilters = () => {
        setSelectedCategories([])
        setSearchQuery("")
        setPriceRange([0, 50000000])
        setLiveOnly(false)
    }

    const hasActiveFilters =
        selectedCategories.length > 0 || searchQuery !== "" || liveOnly || priceRange[0] > 0 || priceRange[1] < 50000000

    if (loading) {
        return (
            <div className="min-h-screen grid bg-background place-items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">{t("Loading auctions...", "ጨረታዎችን በመጫን ላይ...")}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <AxumHeader />
            <main className="min-h-screen bg-background">
                {/* Header */}
                <section className="border-b border-border/30 bg-muted/30 px-4 py-8">
                    <div className="mx-auto max-w-7xl">
                        <h1 className="text-2xl font-bold text-foreground sm:text-3xl mb-2">
                            {t("Browse All Categories", "ሁሉንም ምድቦች ያስሱ")}
                        </h1>
                        <p className="text-muted-foreground">
                            {t("Filter and find the perfect auction for you", "ለእርስዎ ተስማሚ ጨረታ ያጣሩ እና ያግኙ")}
                        </p>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="lg:grid lg:grid-cols-4 lg:gap-6">
                        {/* Filters Sidebar */}
                        <aside className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
                            <Card className="p-4 sticky top-20">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        {t("Filters", "ማጣሪያዎች")}
                                    </h2>
                                    {hasActiveFilters && (
                                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                                            {t("Clear all", "ሁሉንም አጥፋ")}
                                        </Button>
                                    )}
                                </div>

                                {/* Search */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-foreground mb-2 block">{t("Search", "ፈልግ")}</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder={t("Search auctions...", "ጨረታዎችን ይፈልጉ...")}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-foreground mb-3 block">{t("Categories", "ምድቦች")}</label>
                                    <div className="space-y-2">
                                        {Object.entries(categoryDetails).map(([key, value]) => {
                                            const category = key as AuctionCategory
                                            const isSelected = selectedCategories.includes(category)
                                            const count = auctions.filter((a) => a.category === category).length
                                            const IconComponent = iconMap[value.icon as keyof typeof iconMap] || Building

                                            return (
                                                <button
                                                    key={category}
                                                    onClick={() => toggleCategory(category)}
                                                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${isSelected
                                                        ? "bg-primary/10 text-primary border border-primary/30"
                                                        : "hover:bg-muted text-foreground"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent className="h-4 w-4" />
                                                        <span className="text-sm">{value.label[lang]}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {count}
                                                    </Badge>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-foreground mb-3 block">
                                        {t("Price Range (ETB)", "የዋጋ ክልል (ብር)")}
                                    </label>
                                    <Slider
                                        value={priceRange}
                                        onValueChange={(value: number[]) => setPriceRange(value as [number, number])}
                                        min={0}
                                        max={50000000}
                                        step={100000}
                                        className="mb-2"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{formatETB(priceRange[0])}</span>
                                        <span>{formatETB(priceRange[1])}</span>
                                    </div>
                                </div>

                                {/* Live Only */}
                                <div className="mb-6">
                                    <button
                                        onClick={() => setLiveOnly(!liveOnly)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${liveOnly
                                            ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30"
                                            : "hover:bg-muted text-foreground border border-border"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`h-2.5 w-2.5 rounded-full ${liveOnly ? "bg-red-500 live-indicator" : "bg-muted-foreground"}`}
                                            />
                                            <span className="text-sm font-medium">{t("Live Only", "ቀጥታ ብቻ")}</span>
                                        </div>
                                    </button>
                                </div>
                            </Card>
                        </aside>

                        {/* Results */}
                        <div className="lg:col-span-3">
                            {/* Mobile filter toggle & Sort */}
                            <div className="flex items-center justify-between mb-4 gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="lg:hidden gap-2 bg-transparent"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="h-4 w-4" />
                                    {t("Filters", "ማጣሪያዎች")}
                                    {hasActiveFilters && (
                                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                                            {selectedCategories.length + (liveOnly ? 1 : 0)}
                                        </Badge>
                                    )}
                                </Button>

                                <div className="flex items-center gap-2 ml-auto">
                                    <span className="text-sm text-muted-foreground hidden sm:inline">{t("Sort by:", "ደርድር:")}</span>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ending-soon">{t("Ending Soon", "በቅርቡ ያልቃል")}</SelectItem>
                                            <SelectItem value="price-low">{t("Price: Low to High", "ዋጋ: ዝቅተኛ ወደ ከፍተኛ")}</SelectItem>
                                            <SelectItem value="price-high">{t("Price: High to Low", "ዋጋ: ከፍተኛ ወደ ዝቅተኛ")}</SelectItem>
                                            <SelectItem value="most-bids">{t("Most Bids", "ብዙ ጨረታዎች")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Active filter tags */}
                            {hasActiveFilters && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedCategories.map((cat) => (
                                        <Badge key={cat} variant="secondary" className="gap-1 pr-1">
                                            {categoryDetails[cat].label[lang]}
                                            <button
                                                onClick={() => toggleCategory(cat)}
                                                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    {liveOnly && (
                                        <Badge variant="secondary" className="gap-1 pr-1 bg-red-500/10 text-red-600 dark:text-red-400">
                                            {t("Live Only", "ቀጥታ ብቻ")}
                                            <button
                                                onClick={() => setLiveOnly(false)}
                                                className="ml-1 hover:bg-red-500/20 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Results count */}
                            <p className="text-sm text-muted-foreground mb-4">
                                {filteredAuctions.length} {t("auctions found", "ጨረታዎች ተገኝተዋል")}
                            </p>

                            {/* Grid */}
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredAuctions.map((auction) => (
                                    <AuctionCard key={auction.id} auction={auction} />
                                ))}
                            </div>

                            {filteredAuctions.length === 0 && (
                                <div className="py-16 text-center">
                                    <p className="text-muted-foreground mb-4">
                                        {t("No auctions found matching your criteria.", "ከመስፈርትዎ ጋር የሚዛመድ ጨረታ አልተገኘም።")}
                                    </p>
                                    <Button variant="outline" onClick={clearFilters}>
                                        {t("Clear Filters", "ማጣሪያዎችን አጥፋ")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
