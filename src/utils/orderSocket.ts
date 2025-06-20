const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:8000";
let socket: WebSocket | null = null;

export function connectOrderSocket(roomName: string) {
  if (socket) return socket;
  socket = new WebSocket(`${SOCKET_URL}/ws/order/${roomName}/`);
  socket.onopen = () => {
    console.log("주문 웹소켓 연결됨!");
  };
  socket.onclose = () => {
    console.log("주문 웹소켓 연결 해제");
    socket = null;
  };
  return socket;
}

export function disconnectOrderSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function onOrderStatusChanged(cb: (data: any) => void) {
  if (!socket) return;
  socket.onmessage = (event) => {
    cb(event.data);
  };
}

export function sendOrderMessage(message: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  }
}
