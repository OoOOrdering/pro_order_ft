import type React from "react"
import type { Metadata } from "next"
import RootLayout from "./page"

export const metadata: Metadata = {
  title: "PR Order",
  description: "효율적인 주문 관리와 팀 협업을 위한 올인원 플랫폼",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout children={children} />
}
