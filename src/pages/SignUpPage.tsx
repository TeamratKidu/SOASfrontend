import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Loader2, Check } from 'lucide-react';

export default function SignUpPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const { signUp, signInWithGoogle, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return;
        }

        try {
            const result = await signUp({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            // Navigate to OTP verification
            navigate(`/verify-email?userId=${result.userId}&email=${formData.email}`);
        } catch (error) {
            // Error handled by toast
        }
    };

    const passwordStrength = () => {
        const password = formData.password;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const getStrengthColor = () => {
        const strength = passwordStrength();
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStrengthText = () => {
        const strength = passwordStrength();
        if (strength <= 2) return 'Weak';
        if (strength <= 3) return 'Medium';
        return 'Strong';
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex font-display">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-primary/10 to-primary-dark/20 p-12 flex-col justify-between relative overflow-hidden">
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
                        Join AxumAuction
                    </h1>
                    <p className="text-lg text-text-muted max-w-md">
                        Start bidding on premium assets and unlock exclusive auction opportunities
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="size-8 text-primary">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">AxumAuction</span>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-surface-dark text-gray-500'
                                    }`}>
                                    {step > s ? <Check className="w-5 h-5" /> : s}
                                </div>
                                {s < 3 && (
                                    <div className={`flex-1 h-1 mx-2 transition-all ${step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-surface-dark'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                        {step === 1 && 'Create Account'}
                        {step === 2 && 'Set Password'}
                        {step === 3 && 'Almost Done'}
                    </h2>
                    <p className="text-text-muted mb-8">
                        {step === 1 && 'Enter your basic information'}
                        {step === 2 && 'Choose a strong password'}
                        {step === 3 && 'Review and confirm'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Phone Number (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+2519XXXXXXXX"
                                        className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                                    />
                                </div>

                                <div className="relative mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-border-dark"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-background-light dark:bg-background-dark text-text-muted">
                                            Or sign up with
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={signInWithGoogle}
                                    className="w-full py-3 px-4 border-2 border-gray-200 dark:border-border-dark rounded-xl font-semibold text-slate-900 dark:text-white hover:border-primary dark:hover:border-primary transition-all flex items-center justify-center gap-3"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </button>
                            </>
                        )}

                        {/* Step 2: Password */}
                        {step === 2 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                                    {formData.password && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="flex-1 h-2 bg-gray-200 dark:bg-surface-dark rounded-full overflow-hidden">
                                                    <div className={`h-full transition-all ${getStrengthColor()}`} style={{ width: `${(passwordStrength() / 5) * 100}%` }}></div>
                                                </div>
                                                <span className="text-xs font-medium text-text-muted">{getStrengthText()}</span>
                                            </div>
                                            <ul className="text-xs text-text-muted space-y-1">
                                                <li className={formData.password.length >= 8 ? 'text-green-500' : ''}>✓ At least 8 characters</li>
                                                <li className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>✓ One uppercase letter</li>
                                                <li className={/[0-9]/.test(formData.password) ? 'text-green-500' : ''}>✓ One number</li>
                                                <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : ''}>✓ One special character</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        required
                                        className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                                    />
                                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                        <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Step 3: Confirmation */}
                        {step === 3 && (
                            <>
                                <div className="bg-gray-50 dark:bg-surface-dark rounded-xl p-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-text-muted">Name:</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-text-muted">Email:</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{formData.email}</span>
                                    </div>
                                    {formData.phone && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-text-muted">Phone:</span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">{formData.phone}</span>
                                        </div>
                                    )}
                                </div>

                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-text-muted">
                                        I agree to the{' '}
                                        <a href="/terms" className="text-primary hover:text-primary-dark font-semibold">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="/privacy" className="text-primary hover:text-primary-dark font-semibold">Privacy Policy</a>
                                    </span>
                                </label>
                            </>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 pt-4">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 py-3 border-2 border-gray-300 dark:border-border-dark rounded-xl font-semibold text-slate-900 dark:text-white hover:border-primary transition-all"
                                >
                                    Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={
                                        (step === 1 && (!formData.name || !formData.email)) ||
                                        (step === 2 && (!formData.password || formData.password !== formData.confirmPassword))
                                    }
                                    className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Continue
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading || !agreedToTerms}
                                    className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <span className="material-symbols-outlined">check_circle</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-text-muted">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-primary hover:text-primary-dark font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
