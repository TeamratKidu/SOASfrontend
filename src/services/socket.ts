import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

let socket: Socket | null = null;

export const getSocket = (userId?: string): Socket => {
    if (!socket) {
        socket = io(`${WS_URL}/bidding`, {
            auth: {
                userId,
            },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('🔌 WebSocket connected');
        });

        socket.on('disconnect', () => {
            console.log('🔌 WebSocket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('🔌 WebSocket connection error:', error);
        });
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
