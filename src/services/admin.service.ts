import api from './api';

export interface AdminUser {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
    unpaidAuctionsCount: number;
    createdAt: string;
}

export interface AuditLog {
    id: string;
    userId: string | null;
    action: string;
    entityId: string | null;
    ipAddress: string | null;
    details: Record<string, any> | null;
    timestamp: string;
}

export const adminService = {
    async getAllUsers(): Promise<AdminUser[]> {
        const response = await api.get('/admin/users');
        const data = response.data;
        // Backend returns { data, total, page, limit, totalPages }
        return Array.isArray(data) ? data : data.data ?? [];
    },

    async blockUser(userId: string, reason: string): Promise<void> {
        await api.patch(`/admin/users/${userId}/block`, { reason });
    },

    async unblockUser(userId: string): Promise<void> {
        await api.patch(`/admin/users/${userId}/unblock`);
    },

    async getAuditLogs(filters?: {
        startDate?: string;
        endDate?: string;
        userId?: string;
        action?: string;
    }): Promise<AuditLog[]> {
        const response = await api.get('/admin/audit-logs', { params: filters });
        const data = response.data;
        return Array.isArray(data) ? data : data.data ?? [];
    },

    async exportAuditLogs(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
        const response = await api.get('/admin/audit-logs/export', {
            params: { format },
            responseType: 'blob',
        });
        return response.data;
    },
    async getPendingSellers(): Promise<any[]> {
        const response = await api.get('/admin/seller-requests');
        const data = response.data;
        return Array.isArray(data) ? data : data.data ?? [];
    },

    async approveSeller(userId: string): Promise<void> {
        await api.patch(`/admin/seller-requests/${userId}/approve`);
    },

    async rejectSeller(userId: string, reason: string): Promise<void> {
        await api.patch(`/admin/seller-requests/${userId}/reject`, { reason });
    },
};
