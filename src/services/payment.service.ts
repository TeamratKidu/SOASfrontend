import api from './api';

export interface PaymentInitResponse {
    transactionId: string;
    paymentUrl: string;
    amount: number;
    gateway: string;
}

export interface Transaction {
    id: string;
    auctionId: string;
    userId: string;
    amount: number;
    gateway: string;
    status: string;
    createdAt: string;
    paidAt?: string;
}

export const paymentService = {
    async initializePayment(auctionId: string): Promise<PaymentInitResponse> {
        const response = await api.post('/payments/initialize', { auctionId });
        return response.data;
    },

    async getTransactionHistory(): Promise<Transaction[]> {
        const response = await api.get('/payments/my-transactions');
        return response.data;
    },

    async verifyPayment(transactionId: string): Promise<Transaction> {
        const response = await api.get(`/payments/transaction/${transactionId}`);
        return response.data;
    },
};
