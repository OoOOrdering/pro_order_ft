"use client"
import { useState } from "react"
import { getLikeList, deleteLike } from "@/api/swagger"
import Button from "@/components/Button"
import ErrorMessage from "@/components/ErrorMessage"
import Loading from "@/components/Loading"
import { Card } from "@/components/ui/card"
import List from "@/components/List"
import { useQuery } from "@tanstack/react-query"
import { useList } from "../../hooks/useList"
import type { Like } from "../../types/swagger"

export default function LikePage() {
  const { data: list = [], isLoading: loading, error, refetch } = useQuery<Like[]>({
    queryKey: ["likes"],
    queryFn: async () => {
      const res = await getLikeList();
      return res.data;
    },
  });
  const [viewMode, setViewMode] = useState<"list" | "card">("card");

  const handleDelete = async (id: number) => {
    await deleteLike(id);
    refetch();
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
        <>
          {viewMode === "list" ? (
            <List items={list} renderItem={(like: Like) => (
              <div className="flex justify-between items-center">
                <div>
                  대상: {like.content_type_name} #{like.object_id}
                </div>
                <Button onClick={() => handleDelete(like.id)} color="danger" size="sm">
                  좋아요 취소
                </Button>
              </div>
            )} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {list.length === 0 && <div className="py-4 text-gray-400 text-center">좋아요가 없습니다.</div>}
              {list.map((like) => (
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
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
