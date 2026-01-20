import { type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService, type UpgradeToSellerDto } from '../services/auth.service';

export interface User {
    id: string;
    username: string;
    name?: string;
    email: string;
    phone?: string;
    role: 'buyer' | 'seller' | 'admin';
    isActive: boolean;
    avatar?: string;
    trustScore?: number;
    verified?: boolean;
    successfulSales?: number;
    notifications?: any;
    totalBids?: number;
    wonAuctions?: number;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    // This provider is now just a pass-through since we switched to Zustand
    return <>{children}</>;
}

export function useAuth() {
    const { user, isLoading, signIn, signOut, signUp, upgradeToSeller, setUser } = useAuthStore();

    // Map Zustand state/methods to the expected Context shape
    const adaptedUser: User | null = user ? {
        ...user,
        username: user.email, // Fallback since store might not have username
        isActive: user.isActive || true,
        role: user.role as 'buyer' | 'seller' | 'admin',
        // Ensure other fields are present or defaulted
    } : null;

    const login = async (email: string, password: string) => {
        await signIn(email, password);
    };

    const register = async (data: any) => {
        return await signUp(data);
    };

    const logout = async () => {
        await signOut();
    };

    const updateProfile = async (data: any) => {
        // optimistically update store or refetch
        const updated = await authService.updateProfile(data);
        // We need to merge this into the store user
        if (user) {
            setUser({ ...user, ...updated });
        }
    };

    const updatePassword = async (oldPw: string, newPw: string) => {
        // authStore doesn't have simple updatePassword, reusing service
        return await authService.updatePassword(oldPw, newPw);
    };

    const handleUpgradeToSeller = async (data: UpgradeToSellerDto) => {
        // Use store method if available and compatible, or service
        // store has upgradeToSeller but with no args?
        // Let's use service + store update for safety
        const response = await authService.upgradeToSeller(data);
        if (user) {
            setUser({ ...user, role: 'seller' });
        }
    };

    return {
        user: adaptedUser,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        upgradeToSeller: handleUpgradeToSeller,
    };
}
