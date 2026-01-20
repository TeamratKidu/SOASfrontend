"use client"

import { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    User,
    Mail,
    Phone,
    Shield,
    Bell,
    Lock,
    Camera,
    Check,
    AlertCircle,
    Gavel,
    Trophy,
    Star,
    Sun,
    Moon,
    Monitor,
    Globe,
    History, // Added for My Activity
    CreditCard,
} from "lucide-react"
import api from "@/services/api"
import { FeedbackModal } from "@/components/feedback-modal"
import { toast } from "sonner"
import { useNavigate, useSearchParams } from "react-router-dom"
import { EmptyState } from "@/components/ui/empty-state"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"

export function ProfileSettings() {
    const { user, isLoading, updateProfile, updatePassword } = useAuth()
    const { lang, setLang, t } = useLanguage()
    const { theme, setTheme } = useTheme()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const activeTab = searchParams.get("tab") || "profile"

    const setActiveTab = (value: string) => {
        setSearchParams({ tab: value })
    }

    // Profile form state
    const [name, setName] = useState(user?.name || "")
    const [phone, setPhone] = useState(user?.phone || "")
    const [profileSuccess, setProfileSuccess] = useState(false)
    const [profileError, setProfileError] = useState("")

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [passwordError, setPasswordError] = useState("")

    // Notification settings
    const [notifications, setNotifications] = useState(
        user?.notifications || {
            email: true,
            sms: false,
            bidUpdates: true,
            auctionEnding: true,
            wonAuctions: true,
            outbid: true,
        },
    )

    // My Activity State
    const [myBids, setMyBids] = useState<any[]>([])
    const [loadingActivity, setLoadingActivity] = useState(false)
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
    const [selectedAuctionForFeedback, setSelectedAuctionForFeedback] = useState<any>(null)

    // Fetch My Bids
    // Fetch My Bids
    const [lastActivityFetched, setLastActivityFetched] = useState(0)

    const fetchMyActivity = useCallback(async (force = false) => {
        if (!force && Date.now() - lastActivityFetched < 60000 && myBids.length > 0) {
            return;
        }

        setLoadingActivity(true)
        try {
            const response = await api.get('/bids/my-bids')
            setMyBids(response.data)
            setLastActivityFetched(Date.now())
        } catch (error) {
            console.error("Failed to fetch activity", error)
        } finally {
            setLoadingActivity(false)
        }
    }, [lastActivityFetched, myBids.length])

    useEffect(() => {
        if (activeTab === "activity") {
            fetchMyActivity()
        }
    }, [activeTab, fetchMyActivity])

    const openFeedbackModal = (auction: any) => {
        setSelectedAuctionForFeedback(auction)
        setFeedbackModalOpen(true)
    }

    if (!user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center gap-4 py-12">
                        <AlertCircle className="h-12 w-12 text-muted-foreground" />
                        <p className="text-lg font-medium">{t("Please sign in to view your profile", "መገለጫዎን ለማየት እባክዎ ይግቡ")}</p>
                        <Button asChild>
                            <a href="/signin">{t("Sign In", "ግባ")}</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleProfileUpdate = async () => {
        setProfileError("")
        setProfileSuccess(false)
        try {
            await updateProfile({ name, phone })
            setProfileSuccess(true)
            setTimeout(() => setProfileSuccess(false), 3000)
        } catch (error: any) {
            setProfileError(error.message || "Failed to update profile")
        }
    }

    const handlePasswordUpdate = async () => {
        setPasswordError("")
        setPasswordSuccess(false)

        if (newPassword !== confirmPassword) {
            setPasswordError(t("Passwords do not match", "የይለፍ ቃሎች አይዛመዱም"))
            return
        }

        const result = await updatePassword(currentPassword, newPassword)
        if (result.success) {
            setPasswordSuccess(true)
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setTimeout(() => setPasswordSuccess(false), 3000)
        } else {
            setPasswordError(result.error || "Failed to update password")
        }
    }

    const handleNotificationUpdate = async (key: string, value: boolean) => {
        const updatedNotifications = { ...notifications, [key]: value }
        setNotifications(updatedNotifications)
        await updateProfile({ notifications: updatedNotifications })
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage
                            src={user?.avatar || "/placeholder.svg?height=100&width=100&query=user avatar"}
                            alt={user?.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
                        <Camera className="h-4 w-4" />
                    </button>
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                        <Badge
                            variant={user.role === "admin" ? "destructive" : user.role === "seller" ? "default" : "secondary"}
                            className="gap-1"
                        >
                            <Shield className="h-3 w-3" />
                            {user.role === "admin"
                                ? t("Administrator", "አስተዳዳሪ")
                                : user.role === "seller"
                                    ? t("Verified Seller", "የተረጋገጠ ሻጭ")
                                    : t("Buyer", "ገዢ")}
                        </Badge>
                        {user.verified && (
                            <Badge variant="outline" className="gap-1 border-green-500 text-green-500">
                                <Check className="h-3 w-3" />
                                {t("Verified", "የተረጋገጠ")}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex gap-4 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                            <Star className="h-5 w-5" />
                            {user.trustScore}
                        </div>
                        <p className="text-xs text-muted-foreground">{t("Trust Score", "የአመኔታ ነጥብ")}</p>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div>
                        <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                            <Gavel className="h-5 w-5 text-muted-foreground" />
                            {user.totalBids}
                        </div>
                        <p className="text-xs text-muted-foreground">{t("Total Bids", "ጠቅላላ ጨረታዎች")}</p>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div>
                        <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                            <Trophy className="h-5 w-5" />
                            {user.wonAuctions}
                        </div>
                        <p className="text-xs text-muted-foreground">{t("Won", "ያሸነፉ")}</p>
                    </div>
                </div>
            </div>

            {/* Settings Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("Profile", "መገለጫ")}</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2" onClick={() => fetchMyActivity(true)}>
                        <History className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("Activity", "እንቅስቃሴ")}</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Lock className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("Security", "ደህንነት")}</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("Notifications", "ማሳወቂያዎች")}</span>
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("Preferences", "ምርጫዎች")}</span>
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("Profile Information", "የመገለጫ መረጃ")}</CardTitle>
                            <CardDescription>{t("Update your personal information", "የግል መረጃዎን ያዘምኑ")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {profileSuccess && (
                                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-green-500">
                                    <Check className="h-4 w-4" />
                                    {t("Profile updated successfully", "መገለጫ በተሳካ ሁኔታ ተዘምኗል")}
                                </div>
                            )}
                            {profileError && (
                                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    {profileError}
                                </div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t("Full Name", "ሙሉ ስም")}</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("Email", "ኢሜይል")}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input id="email" value={user.email} disabled className="pl-10 bg-muted" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">{t("Email cannot be changed", "ኢሜይል ሊቀየር አይችልም")}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t("Phone Number", "ስልክ ቁጥር")}</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+251911..."
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>{t("User ID", "የተጠቃሚ መታወቂያ")}</Label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input value={user.id} disabled className="pl-10 bg-muted font-mono text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleProfileUpdate} disabled={isLoading}>
                                    {isLoading ? t("Saving...", "በማስቀመጥ ላይ...") : t("Save Changes", "ለውጦችን አስቀምጥ")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("Change Password", "የይለፍ ቃል ቀይር")}</CardTitle>
                            <CardDescription>
                                {t("Keep your account secure with a strong password", "በጠንካራ የይለፍ ቃል መለያዎን ደህንነቱ የተጠበቀ ያድርጉ")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {passwordSuccess && (
                                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-green-500">
                                    <Check className="h-4 w-4" />
                                    {t("Password updated successfully", "የይለፍ ቃል በተሳካ ሁኔታ ተቀይሯል")}
                                </div>
                            )}
                            {passwordError && (
                                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    {passwordError}
                                </div>
                            )}

                            <div className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">{t("Current Password", "የአሁኑ የይለፍ ቃል")}</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">{t("New Password", "አዲስ የይለፍ ቃል")}</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">{t("Confirm New Password", "አዲሱን የይለፍ ቃል ያረጋግጡ")}</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handlePasswordUpdate} disabled={isLoading}>
                                    {isLoading ? t("Updating...", "በማዘመን ላይ...") : t("Update Password", "የይለፍ ቃል አዘምን")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("Notification Preferences", "የማሳወቂያ ምርጫዎች")}</CardTitle>
                            <CardDescription>{t("Choose how you want to be notified", "እንዴት እንዲያሳውቁዎት ይምረጡ")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">{t("Notification Channels", "የማሳወቂያ ቻናሎች")}</h4>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label>{t("Email Notifications", "የኢሜይል ማሳወቂያዎች")}</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {t("Receive updates via email", "በኢሜይል ዝማኔዎችን ይቀበሉ")}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.email}
                                        onCheckedChange={(checked) => handleNotificationUpdate("email", checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label>{t("SMS Notifications", "የSMS ማሳወቂያዎች")}</Label>
                                        <p className="text-sm text-muted-foreground">{t("Receive updates via SMS", "በSMS ዝማኔዎችን ይቀበሉ")}</p>
                                    </div>
                                    <Switch
                                        checked={notifications.sms}
                                        onCheckedChange={(checked) => handleNotificationUpdate("sms", checked)}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">{t("Auction Alerts", "የጨረታ ማንቂያዎች")}</h4>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label>{t("Bid Updates", "የጨረታ ዝማኔዎች")}</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {t("When someone bids on auctions you're watching", "በሚከታተሏቸው ጨረታዎች ላይ ሰው ሲጫረት")}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.bidUpdates}
                                        onCheckedChange={(checked) => handleNotificationUpdate("bidUpdates", checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label>{t("Auction Ending Soon", "ጨረታ ሊያበቃ ነው")}</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {t("Reminders before auctions end", "ጨረታዎች ከማለቃቸው በፊት ማስታወሻዎች")}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.auctionEnding}
                                        onCheckedChange={(checked) => handleNotificationUpdate("auctionEnding", checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label>{t("Won Auctions", "ያሸነፏቸው ጨረታዎች")}</Label>
                                        <p className="text-sm text-muted-foreground">{t("When you win an auction", "ጨረታ ሲያሸንፉ")}</p>
                                    </div>
                                    <Switch
                                        checked={notifications.wonAuctions}
                                        onCheckedChange={(checked) => handleNotificationUpdate("wonAuctions", checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label>{t("Outbid Alerts", "የተወዳደሪ ማንቂያዎች")}</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {t("When someone outbids you", "ሰው ከእርስዎ በላይ ሲጫረት")}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.outbid}
                                        onCheckedChange={(checked) => handleNotificationUpdate("outbid", checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("Display Preferences", "የማሳያ ምርጫዎች")}</CardTitle>
                            <CardDescription>{t("Customize your experience", "ተሞክሮዎን ያብጁ")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">{t("Language", "ቋንቋ")}</h4>
                                <div className="flex gap-2">
                                    <Button
                                        variant={lang === "en" ? "default" : "outline"}
                                        onClick={() => setLang("en")}
                                        className="flex-1"
                                    >
                                        <Globe className="mr-2 h-4 w-4" />
                                        English
                                    </Button>
                                    <Button
                                        variant={lang === "am" ? "default" : "outline"}
                                        onClick={() => setLang("am")}
                                        className="flex-1"
                                    >
                                        <Globe className="mr-2 h-4 w-4" />
                                        አማርኛ
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">{t("Theme", "ገጽታ")}</h4>
                                <div className="flex gap-2">
                                    <Button
                                        variant={theme === "light" ? "default" : "outline"}
                                        onClick={() => setTheme("light")}
                                        className="flex-1"
                                    >
                                        <Sun className="mr-2 h-4 w-4" />
                                        {t("Light", "ብርሃን")}
                                    </Button>
                                    <Button
                                        variant={theme === "dark" ? "default" : "outline"}
                                        onClick={() => setTheme("dark")}
                                        className="flex-1"
                                    >
                                        <Moon className="mr-2 h-4 w-4" />
                                        {t("Dark", "ጨለማ")}
                                    </Button>
                                    <Button
                                        variant={theme === "system" ? "default" : "outline"}
                                        onClick={() => setTheme("system")}
                                        className="flex-1"
                                    >
                                        <Monitor className="mr-2 h-4 w-4" />
                                        {t("System", "ሲስተም")}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("My Activity", "የእኔ እንቅስቃሴ")}</CardTitle>
                            <CardDescription>{t("Auctions you have participated in", "የተሳተፉባቸው ጨረታዎች")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loadingActivity ? (
                                    <SkeletonLoader count={3} type="row" />
                                ) : myBids.length === 0 ? (
                                    <EmptyState
                                        icon={History}
                                        title={t("No activity found", "ምንም እንቅስቃሴ አልተገኘም")}
                                        description={t("You haven't participated in any auctions yet.", "እስካሁን በምንም ጨረታ አልተሳተፉም።")}
                                        action={{
                                            label: t("Browse Auctions", "ጨረታዎችን ያስሱ"),
                                            onClick: () => navigate('/auctions')
                                        }}
                                    />
                                ) : (
                                    myBids.map((bid: any) => (
                                        <div key={bid.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                            <div>
                                                <h4 className="font-medium">{bid.auction?.title}</h4>
                                                <div className="text-sm text-muted-foreground flex gap-2">
                                                    <span>{t("Bid", "ጨረታ")}: {bid.amount} ETB</span>
                                                    <span>•</span>
                                                    <span>{new Date(bid.createdAt).toLocaleDateString()}</span>
                                                    {bid.auction?.status === 'ended' && bid.auction?.winnerId === user.id && (
                                                        <Badge className="ml-2 bg-green-500">{t("Won", "አሸንፈዋል")}</Badge>
                                                    )}
                                                </div>
                                            </div>
                                            {bid.auction?.status === 'ended' && bid.auction?.winnerId === user.id && (
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => navigate(`/payment/${bid.auction.id}`)}>
                                                        <CreditCard className="mr-2 h-4 w-4" />
                                                        {t("Pay Now", "ሽንፍ ይክፈሉ")}
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => openFeedbackModal(bid.auction)}>
                                                        {t("Rate Seller", "ሻጩን ይስጡ")}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Feedback Modal */}
            {selectedAuctionForFeedback && (
                <FeedbackModal
                    isOpen={feedbackModalOpen}
                    onClose={() => {
                        setFeedbackModalOpen(false)
                        setSelectedAuctionForFeedback(null)
                    }}
                    auctionId={selectedAuctionForFeedback.id}
                    toUserId={selectedAuctionForFeedback.sellerId}
                    toUserName="Seller" // We might need to fetch seller name if not in bid object
                    onSuccess={() => toast.success("Thank you for your feedback!")}
                />
            )}
        </div>
    )
}
