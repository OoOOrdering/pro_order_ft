import React from "react";

export function safeRender(value: any): React.ReactNode {
  if (React.isValidElement(value)) return value;
  if (typeof value === "string" || typeof value === "number") return value;
  if (Array.isArray(value)) return value.map((v, i) => <span key={i}>{safeRender(v)}</span>);
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}
