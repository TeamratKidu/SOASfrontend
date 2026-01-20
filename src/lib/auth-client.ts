import { createAuthClient } from 'better-auth/client';
import { emailOTPClient } from 'better-auth/client/plugins';
import { phoneNumberClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',

    plugins: [
        emailOTPClient(),
        phoneNumberClient(),
    ],
});

// Export commonly used methods
export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
} = authClient;
