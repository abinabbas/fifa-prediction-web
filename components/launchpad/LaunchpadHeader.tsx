"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LaunchpadLogo } from "./LaunchpadLogo";
import { PageContainer } from "@/components/launchpad/PageContainer";
import { useAuth } from "@/hooks/useAuth";

interface LaunchpadHeaderProps {
  showNav?: boolean;
}

export function LaunchpadHeader({ showNav = true }: LaunchpadHeaderProps) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    const isAdmin = user?.role === "admin";
    await logout();
    router.push(isAdmin ? "/admin/login" : "/home");
  };

  return (
    <header className="bg-[#fafafa] sticky top-0 z-50 border-b border-slate-100">
      <PageContainer className="py-4 flex items-center justify-between gap-4">
        <LaunchpadLogo />

        <div className="flex items-center gap-4 sm:gap-6">
          {showNav && (
            <nav className="hidden sm:flex items-center gap-7 text-[13px] font-medium text-slate-600">
              <Link href="/home?section=how-it-works" className="hover:text-slate-900 transition-colors">
                How it Works
              </Link>
              <Link href="/home?section=prizes" className="hover:text-slate-900 transition-colors">
                Prizes
              </Link>
              <Link href="/home?section=predict" className="hover:text-slate-900 transition-colors">
                Predict
              </Link>
            </nav>
          )}

          {!loading && user && (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-xs text-slate-500 max-w-[140px] truncate">
                {user.fullName}
              </span>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden sm:inline text-xs font-semibold text-[#1a2b4b] hover:text-[#f97316] transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-lg border border-[#1a2b4b] text-[#1a2b4b] hover:bg-[#1a2b4b] hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {!loading && !user && showNav && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-wide px-3 sm:px-4 py-2 rounded-lg border border-[#1a2b4b] text-[#1a2b4b] hover:bg-[#1a2b4b] hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-xs font-bold uppercase tracking-wide px-3 sm:px-4 py-2 rounded-lg bg-[#f97316] text-white hover:bg-[#ea580c] transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </PageContainer>
    </header>
  );
}
