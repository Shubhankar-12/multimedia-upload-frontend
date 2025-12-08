"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { verifyUser } from "@/lib/store/authSlice";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, token } = useAppSelector(
    (state) => state.auth
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken && !token) {
        router.push(`/login?redirect=${pathname}`);
        return;
      }

      if (storedToken && !isAuthenticated) {
        try {
          await dispatch(verifyUser()).unwrap();
        } catch (error) {
          router.push(`/login?redirect=${pathname}`);
        }
      }
    };

    checkAuth();
  }, [isClient, isAuthenticated, token, dispatch, router, pathname]);

  if (!isClient || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
