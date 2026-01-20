"use client"

import { AxumHeader } from "@/components/axum-header"
import { DiscoveryHub } from "@/components/discovery-hub"
import { Footer } from "@/components/footer"

export default function AuctionListPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <AxumHeader />
            <main className="flex-1">
                <DiscoveryHub />
            </main>
            <Footer />
        </div>
    )
}
