import io from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// One shared live connection for the whole admin panel.
// Not auto-connected, so public site visitors never open it.
const socket = io(API_BASE_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
});

// Join the admin room (server checks the token) — also after every reconnect
const joinAdminRoom = () => socket.emit("admin_connect", localStorage.getItem("adminToken"));
socket.on("connect", joinAdminRoom);

// Call when the admin panel opens
export const connectAdminSocket = () => {
  if (socket.connected) joinAdminRoom();
  else socket.connect();
};

export default socket;