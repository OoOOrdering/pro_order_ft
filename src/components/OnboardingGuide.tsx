import { useState } from "react";
export default function OnboardingGuide() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">서비스 이용 가이드</h2>
        <ul className="list-disc pl-5 text-sm mb-4">
          <li>주문, 채팅, 알림 등 주요 기능을 안내합니다.</li>
          <li>모바일/PC 모두 최적화되어 있습니다.</li>
          <li>언제든 우측 상단에서 테마/언어를 변경할 수 있습니다.</li>
        </ul>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setOpen(false)}>닫기</button>
      </div>
    </div>
  );
}
