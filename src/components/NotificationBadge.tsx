import { useEffect } from "react";
import { connectSocket, onMessage, disconnectSocket } from "../utils/socket";
import Toast from "../components/Toast";

export default function NotificationBadge() {
  useEffect(() => {
    const socket = connectSocket("notification");
    onMessage((data) => {
      Toast.show({ message: data.message, type: "info" });
    });
    return () => disconnectSocket();
  }, []);
  return <span className="inline-block bg-red-500 text-white rounded-full px-2 py-1 text-xs">N</span>;
}
