import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    joinAuction: (auctionId: string) => void;
    leaveAuction: (auctionId: string) => void;
    placeBid: (auctionId: string, amount: number) => void;
    onBidAccepted: (callback: (data: any) => void) => void;
    onAuctionExtended: (callback: (data: any) => void) => void;
    onBidRejected: (callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
    const { user } = useAuthStore();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user) return;

        const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
        const newSocket = io(`${WS_URL}/bidding`, {
            auth: { userId: user.id },
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        newSocket.on('connect', () => {
            console.log('🔌 WebSocket connected');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('🔌 WebSocket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('🔌 WebSocket connection error:', error);
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const joinAuction = (auctionId: string) => {
        if (socket) {
            socket.emit('join-auction', { auctionId });
        }
    };

    const leaveAuction = (auctionId: string) => {
        if (socket) {
            socket.emit('leave-auction', { auctionId });
        }
    };

    const placeBid = (auctionId: string, amount: number) => {
        if (socket) {
            socket.emit('place-bid', { auctionId, amount });
        }
    };

    const onBidAccepted = (callback: (data: any) => void) => {
        if (socket) {
            socket.on('bid-accepted', callback);
        }
    };

    const onAuctionExtended = (callback: (data: any) => void) => {
        if (socket) {
            socket.on('auction-extended', callback);
        }
    };

    const onBidRejected = (callback: (data: any) => void) => {
        if (socket) {
            socket.on('bid-rejected', callback);
        }
    };

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                joinAuction,
                leaveAuction,
                placeBid,
                onBidAccepted,
                onAuctionExtended,
                onBidRejected,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
}
