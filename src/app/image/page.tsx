"use client"
import { useState } from "react"
import ImageUploader from "@/components/ImageUploader"
import PageHeader from "@/components/PageHeader"
import api from "@/utils/axios"

export default function ImagePage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError("")

    const formData = new FormData()
    files.forEach((file) => {
      formData.append("images", file)
    })

    try {
      await api.post("/images/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert("업로드 성공!")
      setFiles([])
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title="이미지 업로드" subtitle="파일을 선택하여 업로드하세요" />

      <ImageUploader onFilesChange={setFiles} />

      {files.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {uploading ? "업로드 중..." : `${files.length}개 파일 업로드`}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
