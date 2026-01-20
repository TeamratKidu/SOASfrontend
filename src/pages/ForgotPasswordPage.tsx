import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { forgotPassword, resetPassword, isLoading } = useAuthStore();

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setStep('otp');
        } catch (error) {
            // Error handled by toast
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return;
        }

        try {
            await resetPassword(email, otp, newPassword);
            // Success - redirect handled by store or show success message
            setStep('email');
            setEmail('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            // Error handled by toast
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-8 font-display">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 bg-primary/10 rounded-full mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">
                            {step === 'email' ? 'lock_reset' : step === 'otp' ? 'pin' : 'key'}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                        {step === 'email' && 'Reset Password'}
                        {step === 'otp' && 'Enter OTP Code'}
                        {step === 'reset' && 'Create New Password'}
                    </h1>
                    <p className="text-text-muted">
                        {step === 'email' && 'Enter your email to receive a reset code'}
                        {step === 'otp' && 'Enter the 6-digit code sent to your email'}
                        {step === 'reset' && 'Choose a strong new password'}
                    </p>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-border-dark">
                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Code
                                        <span className="material-symbols-outlined">send</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 'otp' && (
                        <form onSubmit={(e) => { e.preventDefault(); setStep('reset'); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    required
                                    maxLength={6}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 font-mono text-2xl text-center tracking-widest transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={otp.length !== 6}
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                Continue
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className="w-full py-3 text-sm text-text-muted hover:text-slate-900 dark:hover:text-white"
                            >
                                ← Back to email
                            </button>
                        </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 'reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all"
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

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                                />
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 8}
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <p className="mt-6 text-center text-sm text-text-muted">
                    Remember your password?{' '}
                    <Link to="/signin" className="text-primary hover:text-primary-dark font-semibold">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
