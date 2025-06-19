// 이 컴포넌트는 src/app/dashboard-summary/page.tsx와 중복되므로
// 해당 페이지를 사용하는 것을 권장합니다.

/*
"use client"

import { useEffect, useState } from "react"
import Card from "./Card"

// ... 기존 코드는 src/app/dashboard-summary/page.tsx에서 사용 중
*/

export default function DashboardStats() {
  return (
    <div className="p-4 text-center">
      <p className="text-muted-foreground">
        대시보드 통계는{" "}
        <a href="/dashboard-summary" className="text-primary hover:underline">
          /dashboard-summary
        </a>{" "}
        페이지에서 확인하세요.
      </p>
    </div>
  )
}
