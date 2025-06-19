import dynamic from "next/dynamic";
import Image from "next/image";

const Chart = dynamic(() => import("../components/Chart"), { ssr: false, loading: () => <div>차트 로딩중...</div> });

export default function ExamplePage() {
  return (
    <main>
      <h1>코드 스플리팅/이미지 최적화 샘플</h1>
      <Chart />
      <Image src="/logo.png" alt="로고" width={120} height={60} priority />
    </main>
  );
}
