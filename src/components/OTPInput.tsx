import { useState, useRef, type KeyboardEvent } from 'react';

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    loading?: boolean;
}

export function OTPInput({ length = 6, onComplete, loading = false }: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only take last character
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if complete
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === length) {
            onComplete(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="flex gap-2">
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={loading}
                        className="w-12 h-12 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none disabled:opacity-50"
                    />
                ))}
            </div>
            {loading && (
                <p className="text-sm text-gray-500">Verifying...</p>
            )}
        </div>
    );
}
