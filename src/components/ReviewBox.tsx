// 이 컴포넌트는 ReviewDetail 컴포넌트로 통합 제공됩니다.
export default function ReviewBox() {
  return (
    <div className="p-4 text-center">
      <p className="text-muted-foreground">
        리뷰 상세 보기는 <code className="bg-muted px-2 py-1 rounded">ReviewDetail</code> 컴포넌트를 사용하세요.
      </p>
    </div>
  );
}
