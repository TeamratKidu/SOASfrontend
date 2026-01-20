"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Shield } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
    const { t } = useLanguage()

    return (
        <footer className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <Shield className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold text-foreground">
                                Axum<span className="text-primary">Auction</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                "Ethiopia's trusted digital marketplace for secure government and institutional auctions.",
                                "ለደህንነታቸው የተጠበቁ የመንግስት እና ተቋማዊ ጨረታዎች የኢትዮጵያ የታመነ ዲጂታል ገበያ።",
                            )}
                        </p>
                    </div>

                    {/* Auctions */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">{t("Auctions", "ጨረታዎች")}</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/auctions" className="text-muted-foreground hover:text-primary">
                                    {t("All Auctions", "ሁሉም ጨረታዎች")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories?category=land" className="text-muted-foreground hover:text-primary">
                                    {t("Land & Property", "መሬት እና ንብረት")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories?category=vehicle" className="text-muted-foreground hover:text-primary">
                                    {t("Vehicles", "መኪናዎች")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories?category=ngo-asset" className="text-muted-foreground hover:text-primary">
                                    {t("NGO Assets", "NGO ንብረቶች")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">{t("Company", "ኩባንያ")}</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="text-muted-foreground hover:text-primary">
                                    {t("About Us", "ስለ እኛ")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/audit/AX-2024-001" className="text-muted-foreground hover:text-primary">
                                    {t("Transparency", "ግልጽነት")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-muted-foreground hover:text-primary">
                                    {t("Contact", "እውቂያ")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">{t("Legal", "ህጋዊ")}</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/terms" className="text-muted-foreground hover:text-primary">
                                    {t("Terms of Service", "የአገልግሎት ውሎች")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                                    {t("Privacy Policy", "የግላዊነት ፖሊሲ")}
                                </Link>
                            </li>
                            <li>
                                <Link to="/bidding-rules" className="text-muted-foreground hover:text-primary">
                                    {t("Bidding Rules", "የጨረታ ደንቦች")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2026 AxumAuction. {t("All rights reserved.", "ሁሉም መብቶች የተጠበቁ ናቸው።")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {t("Powered by the Government of Ethiopia", "በኢትዮጵያ መንግስት የሚንቀሳቀስ")}
                    </p>
                </div>
            </div>
        </footer>
    )
}
