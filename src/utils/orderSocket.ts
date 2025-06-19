import { io, Socket } from "socket.io-client";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "wss://api.example.com";
let socket: Socket | null = null;
export function connectOrderSocket() {
  if (socket) return socket;
  socket = io(SOCKET_URL, { transports: ["websocket"] });
  return socket;
}
export function onOrderStatusChanged(cb: (data: any) => void) {
  if (!socket) return;
  socket.on("orderStatusChanged", cb);
}
