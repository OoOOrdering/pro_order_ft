"use client"

import { useState } from "react"
import { cn } from "../lib/utils"
import Button from "./Button"
import Card from "./Card"
import Image from "next/image"

interface ReviewDetailProps {
  review: {
    id: string
    author: {
      nickname: string
      profileImage?: string
    }
    rating: number
    date: string
    orderInfo: {
      title: string
      id: string
    }
    content: string
    images: string[]
    likes: number
    isLiked: boolean
  }
  isAuthor?: boolean
  onLike: () => void
  onReport: () => void
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export default function ReviewDetail({
  review,
  onLike,
  onReport,
  onEdit,
  onDelete,
  isAuthor,
  className,
}: ReviewDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLiked, setIsLiked] = useState(review.isLiked)
  const [likes, setLikes] = useState(review.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
    onLike()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={cn("text-lg", index < rating ? "text-yellow-400" : "text-gray-300")}>
        ⭐
      </span>
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <Card className={cn("p-6 space-y-6", className)}>
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {review.author.profileImage ? (
              <Image
                src={review.author.profileImage || "/placeholder.svg"}
                alt={`${review.author.nickname}의 프로필`}
                className="w-12 h-12 rounded-full object-cover"
                width={48}
                height={48}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-white font-bold">{review.author.nickname.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{review.author.nickname}</h3>
              <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
            </div>

            <div className="flex items-center space-x-1 mt-1">{renderStars(review.rating)}</div>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">주문 정보</h4>
          <p className="font-medium text-foreground">{review.orderInfo.title}</p>
          <p className="text-sm text-muted-foreground">주문번호: {review.orderInfo.id}</p>
        </div>

        {/* Review Content */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">후기 내용</h4>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{review.content}</p>
        </div>

        {/* Images */}
        {review.images.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">첨부 이미지</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {review.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={120}
                    height={120}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn("flex items-center space-x-2", isLiked ? "text-red-500" : "text-muted-foreground")}
          >
            <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
            <span>{likes}</span>
          </Button>

          <div className="flex space-x-2">
            {isAuthor && onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit} className="text-blue-600">
                ✏️ 수정
              </Button>
            )}
            {isAuthor && onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600">
                🗑️ 삭제
              </Button>
            )}
            {!isAuthor && (
              <Button variant="ghost" size="sm" onClick={onReport} className="text-muted-foreground">
                🚨 신고
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              📤 공유
            </Button>
          </div>
        </div>
      </Card>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="확대된 리뷰 이미지"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
