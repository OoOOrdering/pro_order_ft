import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useList<T>(
  key: string | any[],
  fetchList: () => Promise<T[]>,
  options?: Omit<UseQueryOptions<T[], Error>, "queryKey" | "queryFn">,
) {
  const {
    data: list = [],
    error,
    isLoading: loading,
    refetch,
    ...rest
  } = useQuery<T[], Error>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetchList,
    ...options,
  });

  return { list, loading, error, refetch, ...rest };
}
