"use client"
import { useEffect, useState } from "react"
import api from "@/utils/axios"
import Input from "@/components/Input"
import Button from "@/components/Button"

export default function PresetMessagePage() {
  const [list, setList] = useState<any[]>([])
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const categories = ["all", "인사", "주문확인", "제작안내", "배송안내", "완료인사"]

  useEffect(() => {
    api
      .get("/preset-messages/")
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">프리셋 메시지</h2>
      <div className="space-y-4 mb-6">
        <Input placeholder="메시지 검색..." value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "전체" : category}
            </Button>
          ))}
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {list.map((msg, i) => (
          <li key={msg.id || i} className="border-b py-3 flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium">{msg.content}</p>
              {msg.category && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded mt-1 inline-block">
                  {msg.category}
                </span>
              )}
            </div>
            <Button
              size="sm"
              onClick={() => {
                /* 채팅에 삽입 로직 */
              }}
            >
              사용하기
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
