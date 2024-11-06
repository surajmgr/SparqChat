import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL; // Store in env

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // Manual connection control
  reconnection: true, // Allow reconnection
  reconnectionAttempts: 5, // Retry 5 times before failing
  withCredentials: true, // Send cookies
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
