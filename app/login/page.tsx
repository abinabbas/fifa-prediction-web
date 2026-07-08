"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/launchpad/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef1f6] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-[#eef1f6] flex flex-col items-center justify-center px-4 py-10">
      <LoginForm />

      <p className="mt-8 text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/register" className="text-[#f97316] font-semibold hover:underline">
          Register now
        </Link>
      </p>
    </div>
  );
}
