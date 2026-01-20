import api from "@/lib/api"
import type { User } from "@/contexts/AuthContext"

// Define types that match the backend DTOs
export interface LoginDto {
    email: string
    password: string
}

export interface RegisterDto {
    username: string
    email: string
    phone: string
    password: string
}

export interface UpdateProfileDto {
    username?: string
    email?: string
    phone?: string
    avatar?: string
}

export interface UpgradeToSellerDto {
    bio: string
    tinNumber: string
    faydaId: string
    location?: string
    image?: string
}

export const authService = {
    async register(data: RegisterDto): Promise<{ userId: string; message: string }> {
        const response = await api.post("/auth/register", data)
        return response.data
    },

    async verifyOTP(userId: string, otp: string) {
        const response = await api.post('/auth/verify-otp', { userId, otp });
        return response.data;
    },

    async resendOTP(userId: string) {
        const response = await api.post('/auth/resend-otp', { userId });
        return response.data;
    },

    async login(data: LoginDto): Promise<{ user: User }> {
        const response = await api.post("/auth/login", data)
        return response.data
    },

    async logout(): Promise<void> {
        await api.post("/auth/logout")
    },

    async getProfile(): Promise<User> {
        const response = await api.get("/users/profile")
        return response.data
    },

    async updateProfile(data: UpdateProfileDto): Promise<User> {
        const response = await api.patch('/users/profile', data);
        return response.data;
    },

    async upgradeToSeller(data: UpgradeToSellerDto): Promise<User> {
        const response = await api.post('/users/upgrade-to-seller', data);
        return response.data;
    },

    async updatePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
        // Mock implementation or real endpoint if backend supports it
        // For now assuming a hypothetical endpoint
        try {
            await api.post('/auth/password', { oldPassword, newPassword });
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.message || "Failed to update password" };
        }
    }
}
