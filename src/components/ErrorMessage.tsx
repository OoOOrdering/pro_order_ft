"use client";
import React from 'react';

interface ErrorMessageProps {
  message: string
  title?: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, title, onRetry }: ErrorMessageProps) {
  if (!message) return null

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
          {title && <h3 className="text-sm font-medium text-destructive mb-1">{title}</h3>}
          <p className="text-sm text-destructive/80">{message}</p>
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
