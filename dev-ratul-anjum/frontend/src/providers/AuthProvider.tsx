"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const protectedRoutes = ["/rooms", "/profile", "/settings", "/add-chat"];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending: isLoading } = authClient.useSession();

  console.log("provider session : ", session);

  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/sign-up";
  const isProtectedRoute =
    protectedRoutes.includes(pathname) || pathname.startsWith("/rooms/");

  useEffect(() => {
    if (isLoading) return;

    if (session && isAuthPage) {
      router.replace("/rooms");
      return;
    }

    if (!session && isProtectedRoute) {
      const redirectTo = encodeURIComponent(pathname);
      router.replace(`/login?redirectTo=${redirectTo}`);
      return;
    }
  }, [session, isLoading, pathname, router, isAuthPage, isProtectedRoute]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
