"use client"

import React from "react"
import Image from "next/image"

import { useState, useRef, useCallback } from "react"
import { cn } from "../lib/utils"

interface ImageFile {
  file: File
  url: string
  id: string
}

interface ImageUploaderProps {
  maxFiles?: number
  maxSize?: number // MB
  acceptedTypes?: string[]
  onFilesChange?: (files: File[]) => void
  className?: string
}

export default function ImageUploader({
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  onFilesChange,
  className,
}: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const validFiles: ImageFile[] = []
      let errorMessage = ""

      fileArray.forEach((file) => {
        // 파일 타입 검사
        if (!acceptedTypes.includes(file.type)) {
          errorMessage = `지원하지 않는 파일 형식입니다: ${file.name}`
          return
        }

        // 파일 크기 검사
        if (file.size > maxSize * 1024 * 1024) {
          errorMessage = `파일 크기가 너무 큽니다: ${file.name} (최대 ${maxSize}MB)`
          return
        }

        // 최대 파일 수 검사
        if (images.length + validFiles.length >= maxFiles) {
          errorMessage = `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다`
          return
        }

        validFiles.push({
          file,
          url: URL.createObjectURL(file),
          id: Math.random().toString(36).substr(2, 9),
        })
      })

      if (errorMessage) {
        setError(errorMessage)
        setTimeout(() => setError(""), 3000)
      } else {
        setError("")
      }

      if (validFiles.length > 0) {
        const newImages = [...images, ...validFiles]
        setImages(newImages)
        onFilesChange?.(newImages.map((img) => img.file))
      }
    },
    [images, maxFiles, maxSize, acceptedTypes, onFilesChange],
  )

  const removeImage = useCallback(
    (id: string) => {
      setImages((prev) => {
        const imageToRemove = prev.find((img) => img.id === id)
        if (imageToRemove) {
          URL.revokeObjectURL(imageToRemove.url)
        }
        const newImages = prev.filter((img) => img.id !== id)
        onFilesChange?.(newImages.map((img) => img.file))
        return newImages
      })
    },
    [onFilesChange],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const handleUpload = async () => {
    if (images.length === 0) {
      setError("업로드할 이미지를 선택하세요.")
      return
    }
    setUploading(true)
    setError("")
    setUploadedUrl("")
    try {
      const formData = new FormData()
      formData.append("image", images[0].file)
      const response = await fetch("/api/upload/", {
        method: "POST",
        body: formData,
        // 필요시 인증 헤더 추가
      })
      if (!response.ok) throw new Error("업로드 실패: " + response.statusText)
      const result = await response.json()
      setUploadedUrl(result.image_url)
    } catch (err: any) {
      setError(err.message || "업로드 중 오류가 발생했습니다.")
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("w-full", className)}>
      {/* 드래그 앤 드롭 영역 */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          images.length >= maxFiles && "opacity-50 pointer-events-none",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="text-6xl">📸</div>
          <div>
            <p className="text-lg font-medium text-foreground">이미지를 업로드하세요</p>
            <p className="text-sm text-muted-foreground mt-1">드래그 앤 드롭하거나 클릭하여 파일을 선택하세요</p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            disabled={images.length >= maxFiles}
          >
            파일 선택
          </button>

          <p className="text-xs text-muted-foreground">
            최대 {maxFiles}개, 각 파일 최대 {maxSize}MB
          </p>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 업로드된 이미지 미리보기 */}
      {images.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-3">
            업로드된 이미지 ({images.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.file.name}
                    className="w-full h-full object-cover"
                    width={120}
                    height={120}
                  />
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-lg"
                >
                  ×
                </button>

                {/* 파일 정보 */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs truncate">{image.file.name}</p>
                  <p className="text-xs text-gray-300">{formatFileSize(image.file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 업로드 버튼 및 결과 안내 */}
      {images.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? "업로드 중..." : "이미지 업로드"}
          </button>
          {uploadedUrl && (
            <div className="text-green-600 text-sm break-all">
              업로드 성공! URL:{" "}
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {uploadedUrl}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
