"use client";
import React from 'react';
import { safeRender } from "@/lib/safeRender"
import TextRenderer from "@/lib/safeTextRender"

interface ErrorMessageProps {
  message: string
  title?: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, title, onRetry }: ErrorMessageProps) {
  if (!message) return null

  console.log('ErrorMessage:title', typeof title, title)
  console.log('ErrorMessage:message', typeof message, message)

  const safeTitle = typeof title === 'string' ? title : title ? JSON.stringify(title) : undefined;
  const safeMessage = typeof message === 'string' ? message : JSON.stringify(message);

  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          {safeTitle && <h3 className="text-sm font-medium text-destructive mb-1"><TextRenderer value={safeTitle} context="ErrorMessage.title" /></h3>}
          <p className="text-sm text-destructive/80"><TextRenderer value={safeMessage} context="ErrorMessage.message" /></p>
          {onRetry && (
            <button onClick={onRetry} className="mt-2 text-sm text-destructive hover:text-destructive/80 underline">
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
