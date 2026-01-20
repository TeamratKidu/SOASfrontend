"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Card } from "@/components/ui/card"
import {
    Network,
    Scale,
    Layers,
    Zap,
    Shield,
    TrendingUp,
    Users,
    Repeat,
    Lock,
    Eye,
    Target,
    Globe,
    Package,
} from "lucide-react"

export function PlatformFeatures() {
    const { t } = useLanguage()

    const platformFeatures = [
        {
            icon: Network,
            title: t("Network Effects", "የኔትወርክ ውጤቶች"),
            description: t(
                "Every new bidder attracts more sellers, creating a virtuous cycle of growth",
                "እያንዳንዱ አዲስ ተጫራች ተጨማሪ ሻጮችን ይስባል፣ በጎ የእድገት ዑደት ይፈጥራል",
            ),
            stat: "2,450+",
            statLabel: t("Active Users", "ንቁ ተጠቃሚዎች"),
        },
        {
            icon: Scale,
            title: t("Two-Sided Marketplace", "ባለ ሁለት ወገን ገበያ"),
            description: t(
                "Connecting verified government sellers with trusted institutional buyers",
                "የተረጋገጡ የመንግስት ሻጮችን ከታመኑ ተቋማዊ ገዢዎች ጋር ማገናኘት",
            ),
            stat: "340+",
            statLabel: t("Verified Sellers", "የተረጋገጡ ሻጮች"),
        },
        {
            icon: Layers,
            title: t("Multi-Homing Prevention", "ባለብዙ መኖሪያ መከላከል"),
            description: t(
                "Exclusive government partnerships ensure unique inventory only on AxumAuction",
                "ልዩ የመንግስት አጋርነት ልዩ ክምችት በአክሱም ጨረታ ላይ ብቻ እንዲኖር ያረጋግጣል",
            ),
            stat: "100%",
            statLabel: t("Exclusive Listings", "ልዩ ዝርዝሮች"),
        },
        {
            icon: Zap,
            title: t("Instant Matching", "ፈጣን ማዛመድ"),
            description: t(
                "AI-powered recommendations connect buyers with relevant auctions instantly",
                "AI-የሚሠራ ምክሮች ገዢዎችን ወዲያውኑ ከተዛማጅ ጨረታዎች ጋር ያገናኛሉ",
            ),
            stat: "< 3s",
            statLabel: t("Match Time", "የማዛመድ ጊዜ"),
        },
    ]

    const trustFeatures = [
        {
            icon: Shield,
            title: t("Trust Score System", "የእምነት ነጥብ ስርዓት"),
            description: t(
                "Every user has a dynamic trust score based on transaction history",
                "እያንዳንዱ ተጠቃሚ በግብይት ታሪክ ላይ የተመሰረተ ተለዋዋጭ የእምነት ነጥብ አለው",
            ),
        },
        {
            icon: Eye,
            title: t("Transparent Auctions", "ግልጽ ጨረታዎች"),
            description: t(
                "Every bid is publicly recorded with immutable audit trails",
                "እያንዳንዱ ጨረታ ከማይለወጥ የኦዲት ዱካ ጋር በይፋ ተመዝግቧል",
            ),
        },
        {
            icon: Lock,
            title: t("Anti-Sniping Protection", "ፀረ-ስኒፒንግ ጥበቃ"),
            description: t(
                "Automatic time extension prevents last-second bid manipulation",
                "ራስ-ሰር የጊዜ ማራዘሚያ የመጨረሻ ሰከንድ የጨረታ ማጭበርበርን ይከላከላል",
            ),
        },
        {
            icon: Target,
            title: t("Verified Participants", "የተረጋገጡ ተሳታፊዎች"),
            description: t("Government ID verification required for all bidders", "ለሁሉም ተጫራቾች የመንግስት መታወቂያ ማረጋገጫ ያስፈልጋል"),
        },
    ]

    return (
        <section className="py-16 bg-background">
            <div className="mx-auto max-w-7xl px-4">
                {/* Platform Revolution Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Globe className="h-4 w-4" />
                        {t("Platform Revolution", "የመድረክ አብዮት")}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        {t("Built for Network Effects", "ለኔትወርክ ውጤቶች የተገነባ")}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t(
                            "AxumAuction leverages platform economics to create Ethiopia's most efficient marketplace for institutional assets",
                            "አክሱም ጨረታ ለተቋማዊ ንብረቶች የኢትዮጵያን በጣም ቀልጣፋ ገበያ ለመፍጠር የመድረክ ኢኮኖሚክስን ይጠቀማል",
                        )}
                    </p>
                </div>

                {/* Platform Features Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
                    {platformFeatures.map((feature, index) => (
                        <Card key={index} className="p-6 hover:border-primary/30 transition-colors">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                            <div className="pt-4 border-t border-border">
                                <p className="text-2xl font-bold text-primary">{feature.stat}</p>
                                <p className="text-xs text-muted-foreground">{feature.statLabel}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Trust & Governance Section */}
                <div className="bg-imperial/30 dark:bg-imperial/10 rounded-2xl p-8 lg:p-12">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                            {t("Trust & Governance Layer", "የእምነት እና አስተዳደር ንብርብር")}
                        </h3>
                        <p className="text-muted-foreground">
                            {t(
                                "Institutional-grade security for Ethiopia's most valuable transactions",
                                "ለኢትዮጵያ በጣም ዋጋ ላላቸው ግብይቶች ተቋማዊ ደረጃ ደህንነት",
                            )}
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {trustFeatures.map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border mx-auto mb-3">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                                <p className="text-xs text-muted-foreground">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth Flywheel Visualization */}
                <div className="mt-16 text-center">
                    <h3 className="text-xl font-bold text-foreground mb-8">{t("The Growth Flywheel", "የእድገት ፍላይዊል")}</h3>
                    <div className="relative max-w-lg mx-auto">
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            {[
                                { icon: Users, label: t("More Buyers", "ተጨማሪ ገዢዎች") },
                                { icon: TrendingUp, label: t("Higher Prices", "ከፍተኛ ዋጋዎች") },
                                { icon: Package, label: t("More Sellers", "ተጨማሪ ሻጮች") },
                                { icon: Layers, label: t("More Selection", "ተጨማሪ ምርጫ") },
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="flex flex-col items-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary">
                                            <step.icon className="h-7 w-7 text-primary" />
                                        </div>
                                        <span className="text-xs font-medium text-foreground mt-2">{step.label}</span>
                                    </div>
                                    {i < 3 && <Repeat className="h-5 w-5 text-primary/50 mx-2" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
