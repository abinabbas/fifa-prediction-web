"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { LaunchpadLogo } from "@/components/launchpad/LaunchpadLogo";
import { ClockIcon } from "@/components/launchpad/LoginIcons";

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.login(phone);
      setUser(res.user);
      router.push("/home");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Link
        href="/home"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a2b4b] transition-colors hover:text-[#f97316]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_4px_24px_rgba(15,23,42,0.1)] sm:p-10">
      <div className="mb-6 flex justify-center">
        <LaunchpadLogo />
      </div>

      <h1 className="mb-8 text-center text-xl font-bold text-[#1e293b]">Submit Prediction</h1>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="phone"
          className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
        >
          Registered Mobile
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Verification number"
          className="mb-6 block w-full rounded-xl border border-transparent bg-[#f1f5f9] px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20"
          required
        />

        {error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            {error}
            {error.includes("not registered") && (
              <>
                {" "}
                <Link href="/register" className="font-semibold underline">
                  Register
                </Link>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#f97316] py-4 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#ea580c] disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Submit Today's Prediction"}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#eef1f6] px-4 py-2.5">
          <ClockIcon />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a2b4b]">
            Closes 30m Before Kickoff
          </span>
        </div>
      </form>
      </div>
    </div>
  );
}
