import { useRef } from "react";

interface ChatImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ChatImageUpload({ onUpload }: ChatImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "");
    const res = await fetch("https://api.cloudinary.com/v1_1/" + process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + "/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.secure_url) onUpload(data.secure_url);
  };

  return (
    <input
      type="file"
      accept="image/*"
      ref={inputRef}
      onChange={handleChange}
      aria-label="이미지 업로드"
    />
  );
}
