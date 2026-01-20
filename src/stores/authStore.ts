import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authClient } from '../lib/auth-client';
import api from '../lib/api';
import { toast } from 'sonner';

interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: 'admin' | 'seller' | 'buyer';
    emailVerified: boolean;
    phoneVerified?: boolean;
    image?: string;
    trustScore?: number;
    isActive?: boolean;
}

interface Session {
    token: string;
    expiresAt: number;
}

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;

    // Auth methods
    signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
    signUp: (data: { email: string; password: string; name: string; phone?: string }) => Promise<{ userId: string }>;
    signOut: () => Promise<void>;

    // OTP methods
    sendEmailOTP: (email: string, type: 'sign-in' | 'email-verification' | 'forget-password') => Promise<void>;
    verifyEmailOTP: (email: string, otp: string) => Promise<void>;
    sendPhoneOTP: (phone: string) => Promise<void>;
    verifyPhoneOTP: (phone: string, otp: string) => Promise<void>;

    // OAuth methods
    signInWithGoogle: () => void;
    signInWithFacebook: () => void;

    // Password reset
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;

    // Utility
    checkSession: () => Promise<void>;
    upgradeToSeller: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            isLoading: false,

            setUser: (user) => set({ user }),
            setSession: (session) => set({ session }),
            setLoading: (loading) => set({ isLoading: loading }),

            signIn: async (email, password, rememberMe = false) => {
                set({ isLoading: true });
                try {
                    const { data, error } = await authClient.signIn.email({
                        email,
                        password,
                        rememberMe,
                    });

                    if (error) {
                        toast.error(error.message || 'Sign in failed');
                        throw error;
                    }

                    // Better Auth returns user data directly
                    const user = data?.user as any;
                    set({
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            phone: user.phoneNumber,
                            role: user.role || 'buyer',
                            emailVerified: user.emailVerified,
                            phoneVerified: user.phoneNumberVerified,
                            image: user.image,
                            trustScore: user.trustScore,
                            isActive: user.isActive,
                        },
                        session: data as any,
                    });
                    toast.success('Welcome back!');
                } catch (error: any) {
                    console.error('Sign in error:', error);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            signUp: async (data) => {
                set({ isLoading: true });
                try {
                    const result = await authClient.signUp.email({
                        email: data.email,
                        password: data.password,
                        name: data.name,
                        callbackURL: `${window.location.origin}/verify-email`,
                    });

                    if (result.error) {
                        toast.error(result.error.message || 'Sign up failed');
                        throw result.error;
                    }

                    toast.success('Account created! Please verify your email.');
                    return { userId: result.data.user.id };
                } catch (error: any) {
                    console.error('Sign up error:', error);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            signOut: async () => {
                try {
                    await authClient.signOut();
                    set({ user: null, session: null });
                    toast.success('Signed out successfully');
                } catch (error) {
                    console.error('Sign out error:', error);
                }
            },

            sendEmailOTP: async (email, type) => {
                try {
                    await authClient.emailOtp.sendVerificationOtp({
                        email,
                        type,
                    });
                    toast.success('OTP sent to your email');
                } catch (error: any) {
                    toast.error(error.message || 'Failed to send OTP');
                    throw error;
                }
            },

            verifyEmailOTP: async (email, otp) => {
                set({ isLoading: true });
                try {
                    const { data, error } = await authClient.emailOtp.verifyEmail({
                        email,
                        otp,
                    });

                    if (error) {
                        toast.error(error.message || 'Invalid OTP');
                        throw error;
                    }

                    const user = data?.user as any;
                    set({
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            phone: user.phoneNumber,
                            role: user.role || 'buyer',
                            emailVerified: user.emailVerified,
                            phoneVerified: user.phoneNumberVerified,
                            image: user.image,
                        },
                        session: data as any,
                    });
                    toast.success('Email verified successfully!');
                } catch (error) {
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            sendPhoneOTP: async (phone) => {
                try {
                    await authClient.phoneNumber.sendOtp({
                        phoneNumber: phone,
                    });
                    toast.success('OTP sent to your phone');
                } catch (error: any) {
                    toast.error(error.message || 'Failed to send SMS');
                    throw error;
                }
            },

            verifyPhoneOTP: async (phone, otp) => {
                set({ isLoading: true });
                try {
                    const { error } = await authClient.phoneNumber.verify({
                        phoneNumber: phone,
                        code: otp,
                    });

                    if (error) {
                        toast.error(error.message || 'Invalid OTP');
                        throw error;
                    }

                    set({ user: { ...get().user!, phoneVerified: true } });
                    toast.success('Phone verified successfully!');
                } catch (error) {
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            signInWithGoogle: () => {
                authClient.signIn.social({
                    provider: 'google',
                    callbackURL: `${window.location.origin}/auth/callback`,
                });
            },

            signInWithFacebook: () => {
                authClient.signIn.social({
                    provider: 'facebook',
                    callbackURL: `${window.location.origin}/auth/callback`,
                });
            },

            forgotPassword: async (email) => {
                try {
                    await authClient.emailOtp.sendVerificationOtp({
                        email,
                        type: 'forget-password',
                    });
                    toast.success('Password reset code sent to your email');
                } catch (error: any) {
                    toast.error(error.message || 'Failed to send reset code');
                    throw error;
                }
            },

            resetPassword: async (_email, otp, newPassword) => {
                set({ isLoading: true });
                try {
                    const { error } = await authClient.resetPassword({
                        newPassword,
                        token: otp,
                    });

                    if (error) {
                        toast.error(error.message || 'Failed to reset password');
                        throw error;
                    }

                    toast.success('Password reset successfully!');
                } catch (error) {
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            checkSession: async () => {
                try {
                    const { data } = await authClient.getSession();
                    if (data?.user) {
                        const user = data.user as any;
                        set({
                            user: {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                phone: user.phoneNumber,
                                role: user.role || 'buyer',
                                emailVerified: user.emailVerified,
                                phoneVerified: user.phoneNumberVerified,
                                image: user.image,
                                trustScore: user.trustScore,
                                isActive: user.isActive,
                            },
                            session: data as any,
                        });
                    }
                } catch (error) {
                    console.error('Session check error:', error);
                    set({ user: null, session: null });
                }
            },

            upgradeToSeller: async (data: any) => {
                set({ isLoading: true });
                try {
                    await api.post('/users/upgrade-to-seller', data);

                    set((state) => ({
                        user: state.user ? { ...state.user, role: 'seller' } : null
                    }));

                    toast.success('Upgraded to seller successfully!');
                } catch (error: any) {
                    console.error('Upgrade error:', error);
                    toast.error(error.response?.data?.message || error.message || 'Failed to upgrade');
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                session: state.session,
            }),
        }
    )
);

// Initialize session check on app load
if (typeof window !== 'undefined') {
    useAuthStore.getState().checkSession();
}
