// 주문 목록 기능은 /order 페이지에서 통합 제공됩니다.
// 기존 src/app/order/page.tsx와 기능이 유사할 수 있습니다.
// 필요에 따라 하나의 컴포넌트로 통합하는 것을 고려하세요.

"use client"

import Link from "next/link";

export default function OrderList() {
  return (
    <div className="p-4 text-center">
      <p className="text-muted-foreground">
        주문 목록은{" "}
        <Link href="/order" className="text-primary hover:underline">
          /order
        </Link>{" "}
        페이지에서 확인하세요.
      </p>
    </div>
  );
}
