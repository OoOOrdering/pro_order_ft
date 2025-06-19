import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PR Order',
  description: 'PR Order Service',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4 flex gap-4">
          <Link href="/">홈</Link>
          <Link href="/user/profile">내 프로필</Link>
          <Link href="/user/register">회원가입</Link>
          <Link href="/order">주문</Link>
          <Link href="/order/create">주문 생성</Link>
          <Link href="/work">작업</Link>
          <Link href="/chat-room">채팅</Link>
          <Link href="/notification">알림</Link>
          <Link href="/notice">공지</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/cs-post">고객센터</Link>
          <Link href="/review">리뷰</Link>
          <Link href="/like">좋아요</Link>
          <Link href="/dashboard-summary">대시보드</Link>
          <Link href="/analytics">통계</Link>
        </nav>
        <main className="p-4 max-w-3xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
