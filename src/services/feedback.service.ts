import api from './api';

export interface FeedbackData {
    auctionId: string;
    toUserId: string;
    rating: number;
    comment?: string;
}

export interface Feedback {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    fromUser: {
        id: string;
        username: string;
    };
    auction: {
        id: string;
        title: string;
    };
}

export interface UserRating {
    averageRating: number;
    totalFeedback: number;
}

export const feedbackService = {
    async createFeedback(data: FeedbackData): Promise<Feedback> {
        const response = await api.post('/feedback', data);
        return response.data;
    },

    async getFeedbackForUser(userId: string): Promise<Feedback[]> {
        const response = await api.get(`/feedback/user/${userId}`);
        return response.data;
    },

    async getAverageRating(userId: string): Promise<UserRating> {
        const response = await api.get(`/feedback/user/${userId}/rating`);
        return response.data;
    },

    async getFeedbackForAuction(auctionId: string): Promise<Feedback[]> {
        const response = await api.get(`/feedback/auction/${auctionId}`);
        return response.data;
    },
};
