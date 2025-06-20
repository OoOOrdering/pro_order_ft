"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getChatRoom, getChatMessages, createChatMessage } from "@/api/swagger";
import type { ChatRoomCreate, ChatMessageCreate } from "@/types/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import ChatImageUpload from "@/components/ChatImageUpload";
import { connectSocket, onMessage } from "@/utils/socket";
import Image from "next/image";

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
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const [typing, setTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const socketRef = useRef<any>(null);
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

  useEffect(() => {
    if (roomId) {
      socketRef.current = connectSocket(String(roomId));
      onMessage((msg) => {
        setMessages((prev) => [...prev, msg]);
      });
      return () => { socketRef.current && socketRef.current.disconnect(); };
    }
  }, [roomId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const tempId = Date.now();
    setPendingMessages((prev) => [...prev, { id: tempId, content, status: "pending" }]);
    try {
      const data: ChatMessageCreate = { chat_room: Number(roomId), content };
      await createChatMessage(String(roomId), data);
      setContent("");
      fetchMessages();
      setSuccess("메시지 전송 완료");
      setPendingMessages((prev) => prev.filter((m) => m.id !== tempId));
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
      setPendingMessages((prev) => prev.map((m) => m.id === tempId ? { ...m, status: "failed" } : m));
    } finally {
      setLoading(false);
    }
  };

  const retrySend = async (msg: any) => {
    setLoading(true);
    setError("");
    try {
      const data: ChatMessageCreate = { chat_room: Number(roomId), content: msg.content };
      await createChatMessage(String(roomId), data);
      setPendingMessages((prev) => prev.filter((m) => m.id !== msg.id));
      fetchMessages();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (url: string) => {
    setLoading(true);
    setError("");
    try {
      const data: ChatMessageCreate = { chat_room: Number(roomId), content: '' };
      await createChatMessage(String(roomId), data);
      setSuccess("이미지 전송 완료");
      fetchMessages();
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
      {otherTyping && <div className="text-xs text-blue-500 mb-2">상대방이 입력중...</div>}
      <div className="border rounded p-2 h-64 overflow-y-auto bg-white mb-2">
        {messages.map((msg, idx) => (
          <div key={msg.id || idx} className="mb-1">
            <span>{msg.content}</span>
            {msg.image_url && <Image src={msg.image_url} alt="첨부 이미지" className="max-w-xs mt-1" width={320} height={240} />}
          </div>
        ))}
        {pendingMessages.map((msg) => (
          <div key={msg.id} className="mb-1 text-gray-400 flex items-center gap-2">
            <span>{msg.content}</span>
            {msg.status === "pending" && <span>(전송중...)</span>}
            {msg.status === "failed" && <Button size="sm" onClick={() => retrySend(msg)}>재전송</Button>}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 mt-4">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="메시지 입력..."
          aria-label="메시지 입력"
        />
        <Button type="submit" disabled={loading || !content.trim()}>전송</Button>
        <ChatImageUpload onUpload={handleImageUpload} />
      </form>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="mt-4">
        <Button onClick={() => router.push("/chat-room")} color="default">목록</Button>
      </div>
    </div>
  );
}
