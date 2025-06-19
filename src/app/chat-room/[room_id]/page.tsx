"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getChatRoom, getChatMessages, createChatMessage } from "@/api/swagger";
import type { ChatRoomCreate, ChatMessageCreate } from "@/types/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

export default function ChatRoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.room_id;
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const fetchRoom = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getChatRoom(String(roomId));
      setRoom(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getChatMessages(String(roomId));
      setMessages(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (roomId) {
      fetchRoom();
      fetchMessages();
    }
    // eslint-disable-next-line
  }, [roomId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data: ChatMessageCreate = { chat_room: Number(roomId), content };
      await createChatMessage(String(roomId), data);
      setContent("");
      fetchMessages();
      setSuccess("메시지 전송 완료");
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!room) return null;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">채팅방: {room.name}</h2>
      <div className="mb-2 text-xs text-gray-400">참여자: {room.participants?.length || 0}명</div>
      <form onSubmit={handleSend} className="flex gap-2 mb-4">
        <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder="메시지 입력" className="border p-2 flex-1" />
        <Button type="submit" color="primary">전송</Button>
      </form>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <ul className="divide-y">
        {messages.length === 0 && <li className="py-4 text-gray-400">메시지가 없습니다.</li>}
        {messages.map((msg) => (
          <li key={msg.id} className="py-2 text-sm">
            <span className="font-bold">{msg.sender?.nickname || msg.sender?.name || "익명"}</span>: {msg.content}
            <span className="ml-2 text-xs text-gray-400">{msg.created_at?.slice(0, 16)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Button onClick={() => router.push("/chat-room")} color="default">목록</Button>
      </div>
    </div>
  );
}
