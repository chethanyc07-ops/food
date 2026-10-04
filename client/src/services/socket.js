import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket && typeof window !== 'undefined') {
    // Connect to current origin in browser
    const socketOrigin = window.location.origin;

    socket = io(socketOrigin, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      withCredentials: true,
      path: '/socket.io',
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected to server:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection warning:', err.message);
    });
  }
  return socket;
};

export const joinRecommendationRoom = (recommendationId) => {
  const s = getSocket();
  if (s && recommendationId) {
    s.emit('join_recommendation', recommendationId);
  }
};
