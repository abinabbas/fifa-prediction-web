"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AdminLoginForm } from "@/components/launchpad/AdminLoginForm";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.role === "admin") {
      router.replace("/admin");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef1f6] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (user?.role === "admin") return null;

  return (
    <div className="min-h-screen bg-[#eef1f6] flex flex-col items-center justify-center px-4 py-10">
      <AdminLoginForm />
    </div>
  );
}
