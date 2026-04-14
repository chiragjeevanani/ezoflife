import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = API_URL.replace('/api', '');

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true
});

export const connectSocket = (userId) => {
    if (!socket.connected) {
        socket.connect();
    }
    
    // Always call join_room if we have a userId, regardless of when it connected
    if (userId) {
        socket.emit('join_room', `user_${userId}`);
    }

    socket.on('connect', () => {
        console.log('⚡ Connected to Socket.io server');
        if (userId && userId.length === 24) {
            console.log(`📡 Subscribing to room: user_${userId}`);
            socket.emit('join_room', `user_${userId}`);
        } else if (userId) {
            console.error('⚠️ Invalid UserID for socket room:', userId);
        }
    });
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
