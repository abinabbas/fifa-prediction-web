"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /login redirects to the unified auth page with the login tab pre-selected.
 * All existing links to /login continue to work seamlessly.
 */
export default function LoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register?tab=login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef1f6]">
      <span className="inline-block animate-spin text-2xl">⚽</span>
    </div>
  );
}
