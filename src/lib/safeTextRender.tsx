import React from "react";

export function safeTextRender(value: any, context?: string): React.ReactNode {
  if (typeof value === "object" && value !== null && "$typeof" in value) {
    console.warn(
      `[safeTextRender] React Element를 문자열로 렌더링 시도!`,
      { value, context }
    );
    return <span style={{ color: "red" }}>컴포넌트를 직접 렌더할 수 없습니다</span>;
  }
  if (typeof value === "string" || typeof value === "number") return value;
  if (Array.isArray(value)) return value.map((v, i) => <span key={i}>{safeTextRender(v, context)}</span>);
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

export default function TextRenderer({ value, context }: { value: any; context?: string }) {
  return <>{safeTextRender(value, context)}</>;
}
