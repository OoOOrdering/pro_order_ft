"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Message {
  id: number;
  user: string;
  content: string;
  createdAt: string;
}

export default function ChatRoomPage() {
  const { room_id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // 예시: 채팅 메시지 불러오기 (실제 API 연동 필요)
  useEffect(() => {
    // fetch(`/api/chat-room/${room_id}/messages`) 등으로 실제 데이터 불러오기
    setMessages([
      { id: 1, user: "user1", content: "안녕하세요!", createdAt: "2025-06-24 10:00" },
      { id: 2, user: "user2", content: "반갑습니다.", createdAt: "2025-06-24 10:01" },
    ]);
  }, [room_id]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        user: "me",
        content: input,
        createdAt: new Date().toISOString(),
      },
    ]);
    setInput("");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-lg font-bold mb-4">채팅방 #{room_id}</h1>
      <div className="border rounded p-2 h-64 overflow-y-auto bg-white mb-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            <span className="font-semibold">{msg.user}: </span>
            <span>{msg.content}</span>
            <span className="text-xs text-gray-400 ml-2">{msg.createdAt}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 입력..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={handleSend}
        >
          전송
        </button>
      </div>
    </div>
  );
}
