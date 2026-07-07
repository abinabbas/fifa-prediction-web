"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { StadiumIcon } from "@/components/launchpad/LoginIcons";

export function AdminLoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.adminLogin(email, password);
      setUser(res.user);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(15,23,42,0.1)] p-8 sm:p-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-xl bg-[#1a2b4b] flex items-center justify-center shrink-0">
          <StadiumIcon />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1e293b]">Admin Login</h1>
          <p className="text-xs text-slate-500 mt-0.5">For accounts with admin role in database</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a2b4b] focus:ring-2 focus:ring-[#1a2b4b]/20 mb-4"
          required
        />

        <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your admin password"
          className="block w-full px-4 py-3.5 bg-[#f1f5f9] border border-transparent rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1a2b4b] focus:ring-2 focus:ring-[#1a2b4b]/20 mb-6"
          required
        />

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a2b4b] hover:bg-[#0f1a2e] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing in..." : "Sign in to Admin"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        User login?{" "}
        <Link href="/login" className="text-[#f97316] font-semibold hover:underline">
          Predict with phone
        </Link>
      </p>
    </div>
  );
}
