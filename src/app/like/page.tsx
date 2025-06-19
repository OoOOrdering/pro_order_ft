"use client"
import { useEffect, useState } from "react"
import { getLikeList, deleteLike } from "@/api/swagger"
import Button from "@/components/Button"
import ErrorMessage from "@/components/ErrorMessage"
import Loading from "@/components/Loading"
import { Card } from "@/components/ui/card"

export default function LikePage() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "card">("card")

  useEffect(() => {
    setLoading(true)
    getLikeList()
      .then((res) => setList(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    await deleteLike(id)
    setList(list.filter((like) => like.id !== id))
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">내가 누른 좋아요</h2>
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === "list" ? "primary" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            📋
          </Button>
          <Button variant={viewMode === "card" ? "primary" : "outline"} size="sm" onClick={() => setViewMode("card")}>
            🎴
          </Button>
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <Loading />
      ) : (
        <div className={viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "divide-y"}>
          {list.length === 0 && <div className="py-4 text-gray-400 text-center">좋아요가 없습니다.</div>}
          {list.map((like) =>
            viewMode === "card" ? (
              <Card key={like.id} className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">대상: {like.content_type_name}</h3>
                    <p className="text-sm text-muted-foreground">#{like.object_id}</p>
                  </div>
                  <Button onClick={() => handleDelete(like.id)} color="danger" size="sm">
                    취소
                  </Button>
                </div>
              </Card>
            ) : (
              <div key={like.id} className="py-2 flex justify-between items-center">
                <div>
                  대상: {like.content_type_name} #{like.object_id}
                </div>
                <Button onClick={() => handleDelete(like.id)} color="danger" size="sm">
                  좋아요 취소
                </Button>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}
