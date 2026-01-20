import { useLanguage } from "@/contexts/LanguageContext"

import { useParams } from "react-router-dom"
import { AuditView } from "@/components/audit-view"
import { AxumHeader } from "@/components/axum-header"
import { Footer } from "@/components/footer"
import { mockAuctions } from "@/lib/auction-data"

export default function AuditPage() {
    const { t } = useLanguage()
    const { id } = useParams<{ id: string }>()
    const auction = mockAuctions.find(a => a.id === id) || mockAuctions[0]

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <AxumHeader />
            <main className="flex-1">
                {auction ? (
                    <AuditView auction={auction} />
                ) : (
                    <div className="p-8 text-center">{t("Auction not found", "ጨረታ አልተገኘም")}</div>
                )}
            </main>
            <Footer />
        </div>
    )
}
