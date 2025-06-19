import { useState } from "react";
export default function NotificationSettings() {
  const [enabled, setEnabled] = useState(true);
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={enabled} onChange={() => setEnabled((v) => !v)} />
      알림 받기
    </label>
  );
}
