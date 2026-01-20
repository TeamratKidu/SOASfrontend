import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Store, CheckCircle, FileText, Building, Loader2, User, Camera } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { AxumHeader } from "@/components/axum-header"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function UpgradeToSeller() {
    const { t } = useLanguage()
    const { user, upgradeToSeller, isLoading } = useAuth()
    const navigate = useNavigate()
    const [agreed, setAgreed] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        avatar: null as File | null,
        bio: "",
        tinNumber: "", // Ethiopian Tax ID (10 digits)
        faydaId: "", // Fayda Alliance/Identification Number
        location: "",
    })

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, avatar: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Start with this simple check, can be expanded
    if (!user) {
        navigate("/signin");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!agreed) {
            toast.error(t("Please agree to the terms", "እባክዎን ውሎቹን ይስማሙ"))
            return
        }

        try {
            // TODO: Upload avatar to server and get URL
            const imageUrl = avatarPreview || undefined

            await upgradeToSeller({
                bio: formData.bio,
                tinNumber: formData.tinNumber,
                faydaId: formData.faydaId,
                location: formData.location,
                image: imageUrl,
            })

            toast.success(t("Seller upgrade request submitted!", "የሻጭ ማሻሻያ ጥያቄ ቀርቧል!"))
            navigate("/")
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || t("Failed to submit request", "ጥያቄን ማስገባት አልተሳካም"))
        }
    }

    const benefits = [
        { icon: Store, text: t("List unlimited auctions", "ያልተገደበ ጨረታዎችን ዝርዝር ያድርጉ") },
        { icon: Shield, text: t("Verified seller badge", "የተረጋገጠ ሻጭ ባጅ") },
        { icon: CheckCircle, text: t("Priority customer support", "ቅድሚያ የደንበኛ ድጋፍ") },
        { icon: FileText, text: t("Detailed analytics dashboard", "ዝርዝር የትንታኔ ዳሽቦርድ") },
    ]

    return (
        <div className="min-h-screen bg-background">
            <AxumHeader />

            <div className="mx-auto max-w-2xl px-4 py-12">
                <div className="text-center mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 mx-auto mb-4">
                        <Store className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">{t("Become a Seller", "ሻጭ ይሁኑ")}</h1>
                    <p className="text-muted-foreground">
                        {t(
                            "Upgrade your account to start listing auctions on AxumAuction",
                            "በአክሱም ጨረታ ላይ ጨረታዎችን መዝገብ ለመጀመር መለያዎን ያሻሽሉ",
                        )}
                    </p>
                </div>

                {/* Benefits */}
                <Card className="p-6 mb-6">
                    <h2 className="font-semibold text-foreground mb-4">{t("Seller Benefits", "የሻጭ ጥቅሞች")}</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-trust-green/20">
                                    <benefit.icon className="h-4 w-4 text-trust-green" />
                                </div>
                                <span className="text-sm text-foreground">{benefit.text}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Registration Form */}
                <Card className="p-6">
                    <h2 className="font-semibold text-foreground mb-4">{t("Seller Information", "የሻጭ መረጃ")}</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Avatar Upload */}
                        <div className="space-y-2">
                            <Label>{t("Profile Photo", "የመገለጫ ፎቶ")}</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted overflow-hidden">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-12 w-12 text-muted-foreground" />
                                        )}
                                    </div>
                                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center cursor-pointer transition-colors">
                                        <Camera className="h-4 w-4 text-primary-foreground" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">
                                        {t("Upload a professional photo", "ሙያዊ ፎቶ ይስቀሉ")}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {t("Max 5MB, JPG or PNG", "ከፍተኛ 5MB, JPG ወይም PNG")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bio/Description */}
                        <div className="space-y-2">
                            <Label>{t("About You / Business Description", "ስለ እርስዎ / የንግድ መግለጫ")} *</Label>
                            <Textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder={t(
                                    "Tell buyers about yourself or your business...",
                                    "ለገዢዎች ስለራስዎ ወይም ስለንግድዎ ይንገሩ..."
                                )}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>{t("Tax Identification Number (TIN)", "የግብር መለያ ቁጥር")} *</Label>
                                <Input
                                    value={formData.tinNumber}
                                    onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                                    placeholder="0000000000"
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    title={t("TIN must be 10 digits", "TIN 10 አሃዞች መሆን አለበት")}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">{t("10-digit Ethiopian Tax ID", "10-አሃዝ የኢትዮጵያ የግብር መለያ")}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>{t("Fayda ID (FAN/FIN)", "ፋይዳ መለያ (FAN/FIN)")} *</Label>
                                <Input
                                    value={formData.faydaId}
                                    onChange={(e) => setFormData({ ...formData, faydaId: e.target.value })}
                                    placeholder="FAN-XXXXXXXXXX"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">{t("Fayda Alliance/Identification Number", "ፋይዳ አሊያንስ/መለያ ቁጥር")}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t("Location / Address", "አድራሻ")}</Label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="pl-10"
                                    placeholder={t("City, Region", "ከተማ፣ ክልል")}
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pt-4 border-t">
                            <Checkbox id="agree" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                            <Label htmlFor="agree" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                                {t(
                                    "I agree to the Seller Terms of Service and understand that all my listings will be subject to review and verification by AxumAuction administrators.",
                                    "የሻጭ የአገልግሎት ውሎችን ተቀብያለሁ እና ሁሉም ዝርዝሮቼ በአክሱም ጨረታ አስተዳዳሪዎች ግምገማ እና ማረጋገጫ እንደሚደረግባቸው ተረድቻለሁ።",
                                )}
                            </Label>
                        </div>

                        <Button type="submit" className="w-full" disabled={!agreed || isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("Processing...", "በማስኬድ ላይ...")}
                                </>
                            ) : (
                                t("Upgrade to Seller", "ወደ ሻጭ ያሻሽሉ")
                            )}
                        </Button>
                    </form>
                </Card>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    {t(
                        "Your application will be reviewed within 24-48 hours. You'll receive an email notification once approved.",
                        "ማመልከቻዎ በ24-48 ሰዓታት ውስጥ ይገመገማል። ሲጸድቅ የኢሜይል ማሳወቂያ ይደርስዎታል።",
                    )}
                </p>
            </div>
        </div>
    )
}
