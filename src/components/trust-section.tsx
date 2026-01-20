"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Shield, FileCheck, Eye, Lock } from "lucide-react"

const trustFeatures = [
    {
        icon: Shield,
        title: { en: "Government Verified", am: "በመንግስት የተረጋገጠ" },
        description: {
            en: "All sellers are verified government agencies and international organizations",
            am: "ሁሉም ሻጮች የተረጋገጡ የመንግስት ኤጀንሲዎች እና ዓለም አቀፍ ድርጅቶች ናቸው",
        },
    },
    {
        icon: FileCheck,
        title: { en: "Immutable Audit Trail", am: "የማይለወጥ የኦዲት ዱካ" },
        description: {
            en: "Every bid and transaction is recorded with cryptographic verification",
            am: "እያንዳንዱ ጨረታ እና ግብይት በክሪፕቶግራፊክ ማረጋገጫ ይመዘገባል",
        },
    },
    {
        icon: Eye,
        title: { en: "Full Transparency", am: "ሙሉ ግልጽነት" },
        description: {
            en: "View complete bid history and verify any transaction publicly",
            am: "ሙሉ የጨረታ ታሪክን ይመልከቱ እና ማንኛውንም ግብይት በይፋ ያረጋግጡ",
        },
    },
    {
        icon: Lock,
        title: { en: "Secure Escrow", am: "ደህንነቱ የተጠበቀ ኢስክሮ" },
        description: {
            en: "Funds are held securely until successful asset transfer",
            am: "ንብረት በተሳካ ሁኔታ እስኪተላለፍ ድረስ ገንዘብ በደህንነት ይያዛል",
        },
    },
]

export function TrustSection() {
    const { lang, t } = useLanguage()

    return (
        <section className="py-16 px-4 bg-imperial dark:bg-imperial">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("Built on Trust", "በታማኝነት ላይ የተገነባ")}</h2>
                    <p className="mt-2 text-white/70 max-w-2xl mx-auto">
                        {t(
                            "Our platform is designed with security and transparency at its core",
                            "የእኛ መድረክ ደህንነት እና ግልጽነት በመሠረቱ ላይ ተዘጋጅቷል",
                        )}
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {trustFeatures.map((feature, index) => (
                        <div key={index} className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 mb-4">
                                <feature.icon className="h-6 w-6 text-gold" />
                            </div>
                            <h3 className="font-semibold text-white mb-2">{feature.title[lang]}</h3>
                            <p className="text-sm text-white/60">{feature.description[lang]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
