"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { UserPlus, Search, Gavel, CreditCard } from "lucide-react"

const steps = [
    {
        icon: UserPlus,
        title: { en: "Create Account", am: "መለያ ይፍጠሩ" },
        description: {
            en: "Register with your ID and verify your identity to start bidding",
            am: "በመታወቂያዎ ይመዝገቡ እና ማንነትዎን ያረጋግጡ ጨረታ ለመጀመር",
        },
    },
    {
        icon: Search,
        title: { en: "Find Auctions", am: "ጨረታዎችን ያግኙ" },
        description: {
            en: "Browse categories, filter by location, and find your perfect asset",
            am: "ምድቦችን ያስሱ፣ በቦታ ያጣሩ፣ እና ትክክለኛውን ንብረት ያግኙ",
        },
    },
    {
        icon: Gavel,
        title: { en: "Place Your Bid", am: "ጨረታዎን ያስቀምጡ" },
        description: {
            en: "Bid confidently with anti-sniping protection and real-time updates",
            am: "በፀረ-ስኒፒንግ ጥበቃ እና በእውነተኛ ጊዜ ዝመናዎች በበራስ መተማመን ይጫረቱ",
        },
    },
    {
        icon: CreditCard,
        title: { en: "Secure Payment", am: "ደህንነቱ የተጠበቀ ክፍያ" },
        description: {
            en: "Pay via Telebirr, Chapa, or bank transfer within 24 hours",
            am: "በ24 ሰዓታት ውስጥ በቴሌብር፣ ቻፓ ወይም ባንክ ትራንስፈር ይክፈሉ",
        },
    },
]

export function HowItWorks() {
    const { lang, t } = useLanguage()

    return (
        <section className="py-16 px-4">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("How It Works", "እንዴት እንደሚሰራ")}</h2>
                    <p className="mt-2 text-muted-foreground">
                        {t("Start bidding in four simple steps", "በአራት ቀላል ደረጃዎች ጨረታ ይጀምሩ")}
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <div key={index} className="relative text-center">
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                            )}

                            {/* Step number */}
                            <div className="relative inline-flex mb-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                    <step.icon className="h-7 w-7 text-primary" />
                                </div>
                                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                    {index + 1}
                                </span>
                            </div>

                            <h3 className="font-semibold text-foreground mb-2">{step.title[lang]}</h3>
                            <p className="text-sm text-muted-foreground">{step.description[lang]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
