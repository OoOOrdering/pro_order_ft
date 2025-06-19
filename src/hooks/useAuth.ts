import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../utils/token";

export function useAuth(redirectTo = "/(auth)/login") {
  const router = useRouter();
  useEffect(() => {
    if (!getToken()) {
      router.replace(redirectTo);
    }
  }, [router, redirectTo]);
}
