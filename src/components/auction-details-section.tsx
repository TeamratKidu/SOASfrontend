"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Auction } from "@/lib/auction-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, FileText, Download, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface AuctionDetailsSectionProps {
    auction: Auction
}

export function AuctionDetailsSection({ auction }: AuctionDetailsSectionProps) {
    const { lang, t } = useLanguage()
    const [descriptionOpen, setDescriptionOpen] = useState(false)
    const [termsOpen, setTermsOpen] = useState(false)

    return (
        <div className="space-y-4">
            {/* Detailed Description - Expandable */}
            {auction.detailedDescription && (
                <Collapsible open={descriptionOpen} onOpenChange={setDescriptionOpen}>
                    <Card className="overflow-hidden">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <Info className="h-5 w-5 text-primary" />
                                    <span className="font-semibold text-foreground">{t("Detailed Description", "ዝርዝር መግለጫ")}</span>
                                </div>
                                {descriptionOpen ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="px-4 pb-4 pt-0">
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p className="whitespace-pre-line">{auction.detailedDescription[lang]}</p>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>
            )}

            {/* Terms and Conditions - Expandable */}
            {auction.termsAndConditions && (
                <Collapsible open={termsOpen} onOpenChange={setTermsOpen}>
                    <Card className="overflow-hidden">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-primary" />
                                    <span className="font-semibold text-foreground">{t("Terms & Conditions", "ውሎች እና ሁኔታዎች")}</span>
                                    <Badge variant="outline" className="text-[10px] border-destructive/50 text-destructive">
                                        {t("Required", "አስፈላጊ")}
                                    </Badge>
                                </div>
                                {termsOpen ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="px-4 pb-4 pt-0">
                                <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3 mb-3">
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {t("By placing a bid, you agree to these terms", "ጨረታ በማስገባት እነዚህን ውሎች ተቀብለዋል")}
                                    </p>
                                </div>
                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p className="whitespace-pre-line">{auction.termsAndConditions[lang]}</p>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>
            )}

            {/* Attachments */}
            {auction.attachments && auction.attachments.length > 0 && (
                <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">{t("Documents & Attachments", "ሰነዶች እና አባሪዎች")}</span>
                        <Badge variant="secondary" className="text-[10px]">
                            {auction.attachments.length} {t("files", "ፋይሎች")}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        {auction.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                                        <FileText className="h-5 w-5 text-destructive" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{attachment.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {attachment.type.toUpperCase()} • {attachment.size}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                                    <Download className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t("Download", "አውርድ")}</span>
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-trust-green">
                        <CheckCircle className="h-3 w-3" />
                        {t("All documents verified by AxumAuction", "ሁሉም ሰነዶች በአክሱም ጨረታ ተረጋግጠዋል")}
                    </div>
                </Card>
            )}
        </div>
    )
}
