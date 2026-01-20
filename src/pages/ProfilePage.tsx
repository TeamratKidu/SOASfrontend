"use client"

import { ProfileSettings } from "@/components/profile-settings"
import { AxumHeader } from "@/components/axum-header"
import { Footer } from "@/components/footer"

export default function ProfilePage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <AxumHeader />
            <main className="flex-1">
                <ProfileSettings />
            </main>
            <Footer />
        </div>
    )
}
