let socket: WebSocket | null = null;

export function connectSocket(roomName: string) {
  if (socket) return socket;
  const WS_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:8000";
  socket = new WebSocket(`${WS_URL}/ws/chat/${roomName}/`);
  socket.onopen = () => {
    console.log("웹소켓 연결됨!");
  };
  socket.onclose = () => {
    console.log("웹소켓 연결 해제");
    socket = null;
  };
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function onMessage(cb: (msg: any) => void) {
  if (!socket) return;
  socket.onmessage = (event) => {
    cb(event.data);
  };
}

export function sendMessage(message: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  }
}
