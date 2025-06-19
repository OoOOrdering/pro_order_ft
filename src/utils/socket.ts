import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "wss://api.example.com";

let socket: Socket | null = null;

export function connectSocket(token?: string) {
  if (socket) return socket;
  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: token ? { token } : undefined,
  });
  socket.on("connect", () => {
    console.log("실시간 알림 소켓 연결됨");
  });
  socket.on("disconnect", () => {
    console.log("실시간 알림 소켓 연결 해제");
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function onNotification(cb: (data: any) => void) {
  if (!socket) return;
  socket.on("notification", cb);
}

export function onMessage(cb: (msg: any) => void) {
  if (!socket) return;
  socket.on("message", cb);
}
export function sendTyping(roomId: string) {
  socket?.emit("typing", { roomId });
}
export function onTyping(cb: (data: any) => void) {
  socket?.on("typing", cb);
}
export function sendRead(roomId: string) {
  socket?.emit("read", { roomId });
}
export function onRead(cb: (data: any) => void) {
  socket?.on("read", cb);
}
