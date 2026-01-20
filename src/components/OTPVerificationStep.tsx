import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { OTPInput } from '@/components/OTPInput';
import { useNotification } from '@/contexts/NotificationContext';

interface OTPVerificationStepProps {
    userId: string;
    phone: string;
    onBack: () => void;
}

export function OTPVerificationStep({ userId, phone, onBack }: OTPVerificationStepProps) {
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useNotification();

    const handleOTPComplete = async (otp: string) => {
        try {
            setLoading(true);
            const response = await authService.verifyOTP(userId, otp);

            showToast('success', 'Account verified successfully!');

            // Auto-login after verification
            if (response.user) {
                navigate('/');
            }
        } catch (error: any) {
            showToast('error', error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setResending(true);
            await authService.resendOTP(userId);
            showToast('success', 'OTP resent to your phone');
        } catch (error: any) {
            showToast('error', 'Failed to resend OTP. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Verify Your Phone</h2>
                <p className="text-gray-600 mt-2">
                    Enter the 6-digit code sent to {phone}
                </p>
            </div>

            <div className="flex justify-center">
                <OTPInput
                    length={6}
                    onComplete={handleOTPComplete}
                    loading={loading}
                />
            </div>

            <div className="text-center space-y-4">
                <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resending}
                    className="text-primary hover:underline disabled:opacity-50"
                >
                    {resending ? 'Resending...' : 'Resend OTP'}
                </button>

                <div>
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-gray-600 hover:underline"
                    >
                        ← Back to registration
                    </button>
                </div>
            </div>
        </div>
    );
}
