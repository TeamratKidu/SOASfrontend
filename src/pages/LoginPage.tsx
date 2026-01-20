"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, EyeOff, Loader2, Info } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function LoginPage() {
    const { t } = useLanguage()
    const { login, isLoading } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [showTestCredentials, setShowTestCredentials] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            await login(email, password)
            navigate("/")
        } catch (err: any) {
            setError(err.message || "Sign in failed")
        }
    }

    const fillTestCredentials = (role: "admin" | "seller" | "buyer") => {
        const credentials = {
            admin: { email: "admin@axumauction.et", password: "Admin@123" },
            seller: { email: "seller@axumauction.et", password: "Seller@123" },
            buyer: { email: "buyer@axumauction.et", password: "Buyer@123" },
        }
        setEmail(credentials[role].email)
        setPassword(credentials[role].password)
        setShowTestCredentials(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                        <Shield className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold text-foreground">
                        Axum<span className="text-primary">Auction</span>
                    </span>
                </Link>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">{t("Welcome Back", "እንኳን ደህና መጡ")}</CardTitle>
                        <CardDescription>
                            {t("Sign in to your account to continue bidding", "ጨረታውን ለመቀጠል ወደ መለያዎ ይግቡ")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 rounded-lg bg-primary/10 border border-primary/20 p-3">
                            <button
                                type="button"
                                onClick={() => setShowTestCredentials(!showTestCredentials)}
                                className="flex items-center gap-2 text-sm font-medium text-primary w-full"
                            >
                                <Info className="h-4 w-4" />
                                {t("Test Credentials Available", "የሙከራ ማረጋገጫዎች አሉ")}
                            </button>
                            {showTestCredentials && (
                                <div className="mt-3 space-y-2">
                                    <button
                                        type="button"
                                        onClick={() => fillTestCredentials("admin")}
                                        className="w-full text-left px-3 py-2 rounded bg-destructive/10 hover:bg-destructive/20 transition-colors"
                                    >
                                        <p className="text-xs font-semibold text-destructive">Admin</p>
                                        <p className="text-xs text-muted-foreground">admin@axumauction.et / Admin@123</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fillTestCredentials("seller")}
                                        className="w-full text-left px-3 py-2 rounded bg-primary/10 hover:bg-primary/20 transition-colors"
                                    >
                                        <p className="text-xs font-semibold text-primary">Seller</p>
                                        <p className="text-xs text-muted-foreground">seller@axumauction.et / Seller@123</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fillTestCredentials("buyer")}
                                        className="w-full text-left px-3 py-2 rounded bg-muted hover:bg-muted/80 transition-colors"
                                    >
                                        <p className="text-xs font-semibold text-foreground">Buyer</p>
                                        <p className="text-xs text-muted-foreground">buyer@axumauction.et / Buyer@123</p>
                                    </button>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

                            <div className="space-y-2">
                                <Label htmlFor="email">{t("Email", "ኢሜይል")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">{t("Password", "የይለፍ ቃል")}</Label>
                                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                        {t("Forgot password?", "የይለፍ ቃል ረሱ?")}
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("Signing in...", "በመግባት ላይ...")}
                                    </>
                                ) : (
                                    t("Sign In", "ግባ")
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">{t("Don't have an account?", "መለያ የለዎትም?")}</span>{" "}
                            <Link to="/signup" className="text-primary hover:underline font-medium">
                                {t("Sign up", "ተመዝገብ")}
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    {t(
                        "By signing in, you agree to our Terms of Service and Privacy Policy",
                        "በመግባት የአገልግሎት ውሎችን እና የግላዊነት ፖሊሲን ተቀብለዋል",
                    )}
                </p>
            </div>
        </div>
    )
}
