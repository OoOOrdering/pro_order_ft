"use client"

import { useState, useEffect } from "react"
import WaitingQueue from "@/components/WaitingQueue"
import ImageUploader from "@/components/ImageUploader"
import PageHeader from "@/components/PageHeader"

export default function QueueDemoPage() {
  const [position, setPosition] = useState(8)
  const [files, setFiles] = useState<File[]>([])

  // 순번 변경 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => Math.max(1, prev - 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader
        title="대기 순번 & 이미지 업로드 데모"
        subtitle="실시간 대기 순번과 이미지 업로드 기능을 확인해보세요"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 대기 순번 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">구매자 대기 순번</h3>
          <WaitingQueue orderId={12345} currentPosition={position} totalWaiting={15} estimatedTime="약 25분" />
          <p className="text-sm text-muted-foreground mt-4 text-center">* 5초마다 순번이 자동으로 업데이트됩니다</p>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">이미지 업로드</h3>
          <ImageUploader maxFiles={5} maxSize={10} onFilesChange={setFiles} />
          {files.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{files.length}개의 파일이 선택되었습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
