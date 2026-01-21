"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { categoryDetails, type AuctionCategory } from "@/lib/auction-data"
import { Card } from "@/components/ui/card"
import { Building, Car, Heart, Cog, Monitor, Armchair, Factory, Wheat, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "@/lib/api"

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

interface CategoryStat {
    category: string
    count: number
    avgPrice: number
}

export function CategoryShowcase() {
    const { lang, t } = useLanguage()
    const [stats, setStats] = useState<CategoryStat[]>([])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/auctions/statistics/categories')
                setStats(response.data)
            } catch (error) {
                console.error("Failed to fetch category stats:", error)
            }
        }
        fetchStats()
    }, [])

    const categoriesWithCounts = Object.entries(categoryDetails).map(([key, value]) => {
        const stat = Array.isArray(stats) ? stats.find(s => s.category === key) : undefined
        const count = stat?.count || 0
        // Live count not currently available in simple stats endpoint, defaulting to showing just total active
        // Real implementation would need a more detailed stats endpoint or separate counts

        return {
            id: key as AuctionCategory,
            ...value,
            count,
            liveCount: count, // Assuming stats return active auctions
        }
    })

    return (
        <section className="py-16 px-4 bg-muted/30">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("Browse by Category", "በምድብ ይፈልጉ")}</h2>
                    <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                        {t(
                            "Find exactly what you're looking for across our diverse range of government and institutional assets",
                            "በተለያዩ የመንግስት እና ተቋማዊ ንብረቶች ውስጥ የሚፈልጉትን በትክክል ያግኙ",
                        )}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categoriesWithCounts.map((category) => {
                        const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Building
                        return (
                            <Link key={category.id} to={`/categories?category=${category.id}`}>
                                <Card className="group p-6 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <IconComponent className="h-6 w-6 text-primary" />
                                        </div>
                                        {category.liveCount > 0 && (
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10">
                                                <span className="live-indicator h-2 w-2 rounded-full bg-red-500" />
                                                <span className="text-xs font-medium text-red-600 dark:text-red-400">
                                                    {category.liveCount} {t("live", "ቀጥታ")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {category.label[lang]}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1 mb-3">{category.description[lang]}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            {category.count} {t("items", "ዕቃዎች")}
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
