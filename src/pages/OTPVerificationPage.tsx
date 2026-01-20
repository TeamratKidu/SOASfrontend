import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Loader2 } from 'lucide-react';

export default function OTPVerificationPage() {
    const [searchParams] = useSearchParams();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(600); // 10 minutes
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { verifyEmailOTP, sendEmailOTP, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const email = searchParams.get('email') || '';

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all filled
        if (index === 5 && value && newOtp.every(digit => digit)) {
            handleSubmit(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setOtp(newOtp);

        if (pastedData.length === 6) {
            handleSubmit(pastedData);
        }
    };

    const handleSubmit = async (otpCode?: string) => {
        const code = otpCode || otp.join('');
        if (code.length !== 6) return;

        try {
            await verifyEmailOTP(email, code);
            navigate('/');
        } catch (error) {
            // Error handled by toast
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    const handleResend = async () => {
        try {
            await sendEmailOTP(email, 'email-verification');
            setCountdown(600);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            // Error handled by toast
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-8 font-display">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 bg-primary/10 rounded-full mb-4">
                        <span className="material-symbols-outlined text-3xl text-primary">mail</span>
                    </div>

                    <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                        Verify Your Email
                    </h1>
                    <p className="text-text-muted">
                        We sent a 6-digit code to<br />
                        <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-border-dark">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-14 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-background-dark border-2 border-gray-300 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-slate-900 dark:text-white transition-all"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.some(digit => !digit)}
                            className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify Email
                                    <span className="material-symbols-outlined">check_circle</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-text-muted mb-3">
                            <span className="material-symbols-outlined text-lg">schedule</span>
                            <span>Code expires in <span className="font-mono font-semibold text-slate-900 dark:text-white">{formatTime(countdown)}</span></span>
                        </div>

                        {countdown > 0 ? (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isLoading}
                                className="text-sm text-primary hover:text-primary-dark font-semibold disabled:opacity-50"
                            >
                                Resend Code
                            </button>
                        ) : (
                            <p className="text-sm text-red-500">Code expired. Please request a new one.</p>
                        )}
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-text-muted">
                    Wrong email?{' '}
                    <Link to="/signup" className="text-primary hover:text-primary-dark font-semibold">
                        Go back
                    </Link>
                </p>
            </div>
        </div>
    );
}
