// 이 컴포넌트는 /dashboard-summary 페이지에서 통합 제공됩니다.
export default function DashboardStats() {
  return (
    <div className="p-4 text-center">
      <p className="text-muted-foreground">
        대시보드 통계는{" "}
        <a href="/dashboard-summary" className="text-primary hover:underline">
          /dashboard-summary
        </a>{" "}
        페이지에서 확인하세요.
      </p>
    </div>
  );
}
