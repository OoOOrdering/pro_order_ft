"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Bell, User } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "홈", icon: Home },
    { href: "/order", label: "주문", icon: Package },
    { href: "/notification", label: "알림", icon: Bell },
    { href: "/profile", label: "마이페이지", icon: User },
  ]

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 text-xs transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
              <span className="mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
