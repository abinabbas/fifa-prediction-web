"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { ClockIcon } from "@/components/launchpad/LoginIcons";

export function LoginForm({
  onSwitchTab,
}: {
  /** Called when the user wants to switch to the register tab (used in tab context) */
  onSwitchTab?: () => void;
}) {
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
    <form onSubmit={handleSubmit}>
      <label
        htmlFor="login-phone"
        className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a2b4b]"
      >
        <span className="mr-1">📱</span> Registered Mobile
      </label>
      <input
        id="login-phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Verification number"
        className="mb-6 block w-full rounded-xl border border-[#dde3ec] bg-[#f1f5f9] px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 transition-all"
        required
      />

      {error && (
        <div className="mb-5 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
          {error.includes("not registered") && (
            <>
              {" "}
              {onSwitchTab ? (
                <button type="button" onClick={onSwitchTab} className="font-semibold underline">
                  Register
                </button>
              ) : (
                <Link href="/register" className="font-semibold underline">Register</Link>
              )}
            </>
          )}
        </div>
      )}

      {/* Primary CTA */}
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:shadow-[0_6px_24px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" }}
      >
        <span className="absolute inset-0 -skew-x-12 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <span className="inline-block animate-spin">⚽</span>
              Verifying…
            </>
          ) : (
            <>🏆 Submit Today&apos;s Prediction 🏆</>
          )}
        </span>
      </button>

      {/* Kickoff reminder */}
      <div className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#eef1f6] px-4 py-2.5">
        <ClockIcon />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a2b4b]">
          Closes 30m Before Kickoff
        </span>
      </div>
    </form>
  );
}
