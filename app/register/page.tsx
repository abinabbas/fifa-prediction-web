"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RegisterForm } from "@/components/launchpad/RegisterForm";

export default function RegisterAliasPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [loading, user, router]);

  if (loading || user) return null;

  return (
    <div className="min-h-screen bg-[#eef1f6] flex items-center justify-center px-4 py-10">
      <RegisterForm />
    </div>
  );
}
