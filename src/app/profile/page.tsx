"use client";
import { useEffect, useState } from "react";
import { getProfile, updateProfile, deleteProfile, logout } from "@/api/swagger";
import { removeToken } from "@/utils/token";
import { useRouter } from "next/navigation";
import type { User, ProfileUpdate } from "@/types/swagger";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<ProfileUpdate>({ name: "", nickname: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((res) => {
        setUser(res.data);
        setForm({
          name: res.data.name,
          nickname: res.data.nickname,
          phone: res.data.phone || "",
        });
      })
      .catch((err) => setError("인증 필요: " + (err.response?.data?.detail || err.message)))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    removeToken();
    router.push("/login");
  };

  const handleEdit = () => setEdit(true);
  const handleCancel = () => {
    setEdit(false);
    if (user) setForm({ name: user.name, nickname: user.nickname, phone: user.phone || "" });
    setError("");
    setSuccess("");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      setEdit(false);
      setSuccess("프로필이 저장되었습니다.");
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm("정말 탈퇴하시겠습니까?")) return;
    setLoading(true);
    setError("");
    try {
      await deleteProfile();
      removeToken();
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">프로필</h2>
      {user.image_url && (
        <img src={user.image_url} alt="프로필 이미지" className="w-24 h-24 rounded-full mx-auto mb-4" />
      )}
      <div className="mb-2 text-sm text-gray-500">{user.email} ({user.user_type_display || user.user_type})</div>
      <div className="mb-2 text-xs text-gray-400">가입일: {user.created_at?.slice(0, 10)}</div>
      <div className="mb-2 text-xs text-gray-400">이메일 인증: {user.is_email_verified ? "완료" : "미완료"}</div>
      {edit ? (
        <div className="space-y-2">
          <Input name="name" value={form.name} onChange={handleChange} label="이름" />
          <Input name="nickname" value={form.nickname} onChange={handleChange} label="닉네임" />
          <Input name="phone" value={form.phone} onChange={handleChange} label="휴대폰" />
          <div className="flex gap-2 mt-2">
            <Button onClick={handleSave} color="primary">저장</Button>
            <Button onClick={handleCancel} color="default">취소</Button>
          </div>
        </div>
      ) : (
        <>
          <pre className="bg-gray-100 p-4 rounded mb-4 text-xs">{JSON.stringify(user, null, 2)}</pre>
          <div className="flex gap-2">
            <Button onClick={handleEdit} color="primary">프로필 수정</Button>
            <Button onClick={handleLogout} color="default">로그아웃</Button>
            <Button onClick={handleDelete} color="danger">탈퇴</Button>
          </div>
        </>
      )}
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {user.user_type === "ADMIN" && <div className="mt-4 text-blue-600">[관리자 계정]</div>}
      {user.user_type === "BLACKLIST" && <div className="mt-4 text-red-600">[블랙리스트 계정 - 일부 기능 제한]</div>}
    </div>
  );
}
