import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const { signIn, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signIn(email, password, rememberMe);
            navigate('/');
        } catch (error) {
            // Error already handled by toast in store
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex font-display">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-primary/10 to-primary-dark/20 p-12 flex-col justify-between relative overflow-hidden">
                {/* ... (branding content unchanged) ... */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-dark/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="size-10 text-primary">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">AxumAuction</span>
                    </div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white leading-tight">
                        Welcome Back
                    </h1>
                    <p className="text-lg text-text-muted max-w-md">
                        Sign in to continue bidding on premium assets and manage your auctions
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* ... (mobile logo and oauth buttons) ... */}

                    <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                        Sign In
                    </h2>
                    {/* ... (rest of the form header) ... */}

                    {/* Email/Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* ... (inputs) ... */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-text-muted">Remember me</span>
                            </label>

                            <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark font-semibold">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-text-muted">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary hover:text-primary-dark font-semibold">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
