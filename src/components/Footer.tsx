import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary-dark">
                <span className="text-sm font-bold text-primary-foreground">PR</span>
              </div>
              <span className="text-lg font-bold text-foreground">PR Order</span>
            </div>
            <p className="text-sm text-muted-foreground">효율적인 주문 관리와 팀 협업을 위한 올인원 플랫폼</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">빠른 링크</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/order" className="text-muted-foreground hover:text-foreground">
                  주문 관리
                </Link>
              </li>
              <li>
                <Link href="/chat-room" className="text-muted-foreground hover:text-foreground">
                  채팅
                </Link>
              </li>
              <li>
                <Link href="/dashboard-summary" className="text-muted-foreground hover:text-foreground">
                  대시보드
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">고객 지원</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/cs-post" className="text-muted-foreground hover:text-foreground">
                  고객센터
                </Link>
              </li>
              <li>
                <Link href="/notice" className="text-muted-foreground hover:text-foreground">
                  공지사항
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">연락처</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>이메일: support@prorder.com</li>
              <li>전화: 02-1234-5678</li>
              <li>운영시간: 평일 9:00-18:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PR Order. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
