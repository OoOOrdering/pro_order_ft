"use client";
import { useEffect, useState } from "react";
import { getChatRoomList, createChatRoom } from "@/api/swagger";
import type { ChatRoomCreate } from "@/types/swagger";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { useRouter } from "next/navigation";

export default function ChatRoomListPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getChatRoomList();
      setRooms(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchRooms(); }, []);

  const handleCreate = async () => {
    const name = prompt("채팅방 이름을 입력하세요");
    if (!name) return;
    setLoading(true);
    setError("");
    try {
      const data: ChatRoomCreate = { name, participant_ids: [] };
      const res = await createChatRoom(data);
      setSuccess("채팅방이 생성되었습니다.");
      router.push(`/chat-room/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">채팅방 목록</h2>
      <Button onClick={handleCreate} color="primary">채팅방 생성</Button>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <ul className="divide-y mt-4">
        {rooms.length === 0 && <li className="py-4 text-gray-400">채팅방이 없습니다.</li>}
        {rooms.map((room) => (
          <li key={room.id} className="py-2 flex justify-between items-center">
            <span>{room.name}</span>
            <Button onClick={() => router.push(`/chat-room/${room.id}`)} color="default">입장</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
