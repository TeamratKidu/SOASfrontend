import { io, Socket } from "socket.io-client"

// We use a singleton pattern to ensure only one socket connection is established
let socket: Socket | null = null

export const getSocket = (): Socket => {
    if (!socket || !socket.connected) {
        // In local development, we might not need the full URL if proxy is set up correctly
        // But for Socket.IO it often helps to be explicit or use relative path if same domain
        // Since we are proxying /api, we might need to proxy /socket.io as well or point directly
        // For now, let's try relative path with path option if needed, or default
        // The backend gateway is at /bidding namespace

        socket = io("/bidding", {
            autoConnect: false,
            withCredentials: true,
            path: "/socket.io", // Default path for NestJS Gateway
            transports: ["websocket", "polling"],
        })
    }
    return socket
}

export const connectSocket = (userId?: string) => {
    const s = getSocket()
    if (userId) {
        s.auth = { userId }
    }
    if (!s.connected) {
        s.connect()
    }
    return s
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}
