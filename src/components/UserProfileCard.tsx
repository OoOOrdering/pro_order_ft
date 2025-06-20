"use client"
import { cn } from "../lib/utils"
import Image from "next/image"

interface UserProfileCardProps {
  avatar?: string
  nickname: string
  email: string
  className?: string
  onClick?: () => void
}

export default function UserProfileCard({ avatar, nickname, email, className, onClick }: UserProfileCardProps) {
  return (
    <div
      className={cn(
        "w-[90%] max-w-[300px] mx-auto bg-[#f3f0ff] rounded-2xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar */}
        <div className="relative">
          {avatar ? (
            <Image
              src={avatar || "/placeholder.svg"}
              alt={`${nickname}의 프로필`}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              width={80}
              height={80}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center border-4 border-white shadow-md">
              <span className="text-white text-2xl font-bold">{nickname.charAt(0).toUpperCase()}</span>
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white"></div>
        </div>

        {/* User Info */}
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-gray-800">{nickname}</h3>
          <p className="text-sm text-gray-600 break-all">{email}</p>
        </div>

        {/* Status Badge */}
        <div className="px-3 py-1 bg-white/70 rounded-full">
          <span className="text-xs font-medium text-purple-700">활성 사용자</span>
        </div>
      </div>
    </div>
  )
}
