import { io } from "socket.io-client";

// Empty string means same origin where app is served; during development
// frontend runs on localhost:3000 and backend on localhost:5000, so set URL
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
});

export default socket;
