"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { StadiumIcon, ClockIcon } from "@/components/launchpad/LoginIcons";

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
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(15,23,42,0.1)] p-8 sm:p-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-xl bg-[#f97316] flex items-center justify-center shrink-0">
          <StadiumIcon />
        </div>
        <h1 className="text-xl font-bold text-[#1e293b]">Submit Prediction</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">
          Registered Mobile
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Verification number"
          className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 mb-6"
          required
        />

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
            {error.includes("not registered") && (
              <>
                {" "}
                <Link href="/" className="underline font-semibold">
                  Register
                </Link>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl disabled:opacity-50 transition-colors"
        >
          {loading ? "Verifying..." : "Submit Today's Prediction"}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 bg-[#eef1f6] rounded-full py-2.5 px-4">
          <ClockIcon />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a2b4b]">
            Closes 30m Before Kickoff
          </span>
        </div>
      </form>
    </div>
  );
}
