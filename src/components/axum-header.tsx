"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuthStore } from "@/stores/authStore"
import { useNotification } from "@/contexts/NotificationContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
    Shield,
    Globe,
    Menu,
    Bell,
    Sun,
    Moon,
    Monitor,
    LogOut,
    Gavel,
    X,
    Store,
    User,
    LayoutDashboard,
    Settings,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

export function AxumHeader() {
    const { lang, setLang, t } = useLanguage()
    const { setTheme, resolvedTheme } = useTheme()
    const navigate = useNavigate()
    const { user, signOut: logout } = useAuthStore()
    const { toasts } = useNotification()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const unreadCount = toasts.length

    return (
        <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Shield className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-lg font-bold text-foreground">Axum</span>
                        <span className="text-lg font-bold text-primary">Auction</span>
                    </div>
                </Link>

                {/* Navigation - Desktop */}
                <nav className="hidden items-center gap-6 md:flex">
                    <Link to="/" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
                        {t("Home", "መነሻ")}
                    </Link>
                    <Link
                        to="/auctions"
                        className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                    >
                        {t("Auctions", "ጨረታዎች")}
                    </Link>
                    <Link
                        to="/categories"
                        className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                    >
                        {t("Categories", "ምድቦች")}
                    </Link>
                    <Link
                        to="/audit/AX-2024-001"
                        className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                    >
                        {t("Transparency", "ግልጽነት")}
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Language Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLang(lang === "en" ? "am" : "en")}
                        className="gap-1.5 text-xs"
                    >
                        <Globe className="h-4 w-4" />
                        <span className="hidden sm:inline">{lang === "en" ? "አማ" : "EN"}</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                {resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                <Sun className="mr-2 h-4 w-4" />
                                {t("Light", "ብርሃን")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <Moon className="mr-2 h-4 w-4" />
                                {t("Dark", "ጨለማ")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                <Monitor className="mr-2 h-4 w-4" />
                                {t("System", "ሲስተም")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications - Only show when logged in */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                                    <Bell className="h-4 w-4" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                            {unreadCount > 9 ? "9+" : unreadCount}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <div className="flex items-center justify-between px-4 py-2 border-b">
                                    <span className="font-semibold text-sm">{t("Notifications", "ማሳወቂያዎች")}</span>
                                    {unreadCount > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                            {unreadCount} {t("New", "አዲስ")}
                                        </Badge>
                                    )}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {toasts.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            {t("No new notifications", "ምንም አዲስ ማሳወቂያዎች የሉም")}
                                        </div>
                                    ) : (
                                        toasts.map((notification: any, index: number) => (
                                            <div key={index} className="px-4 py-3 border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium leading-none mb-1">
                                                            {notification.title || t("Notification", "ማሳወቂያ")}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {notification.description}
                                                        </p>
                                                        <span className="text-[10px] text-muted-foreground mt-1 block">
                                                            {t("Just now", "በቅርቡ")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-2 border-t bg-muted/20">
                                    <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                                        {t("View All", "ሁሉንም ይመልከቱ")}
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="hidden gap-2 sm:flex">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="max-w-24 truncate text-sm">{user?.name?.split(" ")[0]}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="px-2 py-1.5">
                                    <p className="text-sm font-medium">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    <div className="mt-1">
                                        <span
                                            className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${user.role === "admin"
                                                ? "bg-destructive/20 text-destructive"
                                                : user.role === "seller"
                                                    ? "bg-primary/20 text-primary"
                                                    : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            {user.role === "admin"
                                                ? t("Admin", "አስተዳዳሪ")
                                                : user.role === "seller"
                                                    ? t("Seller", "ሻጭ")
                                                    : t("Buyer", "ገዢ")}
                                        </span>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/profile")}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    {t("Profile Settings", "የመገለጫ ቅንብሮች")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/profile")}>
                                    <User className="mr-2 h-4 w-4" />
                                    {t("My Dashboard", "ዳሽቦርዴ")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/profile?tab=activity")}>
                                    <Gavel className="mr-2 h-4 w-4" />
                                    {t("My Bids", "ጨረታዎቼ")}
                                </DropdownMenuItem>

                                {user.role === "seller" && (
                                    <DropdownMenuItem onClick={() => navigate("/seller")}>
                                        <Store className="mr-2 h-4 w-4" />
                                        {t("Seller Dashboard", "የሻጭ ዳሽቦርድ")}
                                    </DropdownMenuItem>
                                )}

                                {user.role === "buyer" && (
                                    <DropdownMenuItem onClick={() => navigate("/become-seller")}>
                                        <Store className="mr-2 h-4 w-4" />
                                        {t("Start Selling", "ሻጭ ይሁኑ")}
                                    </DropdownMenuItem>
                                )}

                                {user.role === "admin" && (
                                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        {t("Admin Dashboard", "የአስተዳዳሪ ዳሽቦርድ")}
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {t("Sign Out", "ውጣ")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/signin">{t("Sign In", "ግባ")}</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link to="/signup">{t("Sign Up", "ተመዝገብ")}</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="border-t border-border/50 bg-background px-4 py-4 md:hidden">
                    <nav className="flex flex-col gap-3">
                        <Link to="/" className="text-sm font-medium text-foreground/80" onClick={() => setMobileMenuOpen(false)}>
                            {t("Home", "መነሻ")}
                        </Link>
                        <Link
                            to="/auctions"
                            className="text-sm font-medium text-foreground/80"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t("Auctions", "ጨረታዎች")}
                        </Link>
                        <Link
                            to="/categories"
                            className="text-sm font-medium text-foreground/80"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t("Categories", "ምድቦች")}
                        </Link>
                        <Link
                            to="/audit/AX-2024-001"
                            className="text-sm font-medium text-foreground/80"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t("Transparency", "ግልጽነት")}
                        </Link>

                        {user && (
                            <Link
                                to="/profile"
                                className="text-sm font-medium text-foreground/80"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t("Profile Settings", "የመገለጫ ቅንብሮች")}
                            </Link>
                        )}

                        {user?.role === "seller" && (
                            <Link
                                to="/seller"
                                className="text-sm font-medium text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t("Seller Dashboard", "የሻጭ ዳሽቦርድ")}
                            </Link>
                        )}
                        {user?.role === "admin" && (
                            <Link to="/admin" className="text-sm font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>
                                {t("Admin Dashboard", "የአስተዳዳሪ ዳሽቦርድ")}
                            </Link>
                        )}

                        {!user && (
                            <div className="flex gap-2 pt-2 border-t border-border/50 mt-2">
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                                    <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                                        {t("Sign In", "ግባ")}
                                    </Link>
                                </Button>
                                <Button size="sm" className="flex-1" asChild>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                        {t("Sign Up", "ተመዝገብ")}
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}
