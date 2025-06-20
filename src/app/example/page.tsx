// 이 페이지는 코드 스플리팅/이미지 최적화 샘플입니다. 실제 기능은 각 대표 페이지에서 확인하세요.
import Image from "next/image";

export default function ExamplePage() {
  return (
    <main className="p-4 text-center">
      <h1>코드 스플리팅/이미지 최적화 샘플</h1>
      <p className="text-muted-foreground">실제 기능은 각 도메인별 대표 페이지에서 확인하세요.</p>
      <Image src="/logo.png" alt="로고" width={120} height={60} priority />
    </main>
  );
}
