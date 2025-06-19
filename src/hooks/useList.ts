import { useEffect, useState } from "react";

export function useList<T>(fetchList: () => Promise<T[]>) {
  const [list, setList] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchList();
      setList(data);
    } catch (err: any) {
      setError(err.message || "데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { list, setList, loading, error, fetch };
}
