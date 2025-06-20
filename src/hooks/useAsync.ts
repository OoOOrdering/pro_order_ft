import { useState, useCallback } from "react";

interface UseAsyncOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  resetOnSuccess?: boolean;
}

export function useAsync<T = any>(fn: (...args: any[]) => Promise<T>, options: UseAsyncOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<T | null>(null);

  const run = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fn(...args);
      setResult(res);
      setSuccess("성공적으로 처리되었습니다.");
      options.onSuccess?.(res);
      if (options.resetOnSuccess) {
        setTimeout(() => setSuccess(null), 2000);
      }
      return res;
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || String(err));
      options.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fn, options]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(null);
    setResult(null);
  }, []);

  return { run, loading, error, success, result, reset };
}
