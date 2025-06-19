// 이 컴포넌트는 src/components/ReviewDetail.tsx와 기능이 중복됩니다.
// 상세 리뷰 표시는 ReviewDetail 컴포넌트를 사용하세요.

/*
"use client"

import { useState } from "react"
import Card from "./Card"

// ... 기존 코드는 ReviewDetail에서 더 완전한 형태로 구현됨
*/

export default function ReviewBox() {
  return (
    <div className="p-4 text-center">
      <p className="text-muted-foreground">
        리뷰 상세 보기는 <code className="bg-muted px-2 py-1 rounded">ReviewDetail</code> 컴포넌트를 사용하세요.
      </p>
    </div>
  )
}
