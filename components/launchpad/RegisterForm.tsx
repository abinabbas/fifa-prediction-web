"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { LaunchpadLogo } from "@/components/launchpad/LaunchpadLogo";

const labelClass =
  "block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 mb-1.5";

const inputClass =
  "block w-full px-3.5 py-[11px] border border-[#dde3ec] rounded-lg bg-white text-sm text-slate-800 placeholder:text-[#b0bac8] focus:outline-none focus:border-[#1a2b4b] focus:ring-2 focus:ring-[#1a2b4b]/10";

const INTEREST_OPTIONS = ["Digital Marketing", "Coding", "Cybersecurity", "Data Science", "Other"];

const EXPECTED_SALARY_OPTIONS = ["Upto 25000", "25000 to 50000", "Above 50000"];

export function RegisterForm({ onSuccessRedirect = "/home" }: { onSuccessRedirect?: string }) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    interestedIn: "",
    expectedSalary: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.register(form);
      setUser(res.user);
      router.push(onSuccessRedirect);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <Link
        href="/home"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a2b4b] transition-colors hover:text-[#f97316]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="rounded-[14px] border border-slate-200 bg-[#f4f6f9] p-6 shadow-[0_2px_16px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-6 flex justify-center">
        <LaunchpadLogo />
      </div>

      <h1 className="mb-8 text-center text-lg font-bold text-[#1a2b4b]">New Registration</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className={labelClass}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Enter your name"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Mobile Number
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+91 00000 00000"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="email" className={labelClass}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="yourname@email.com"
            className={inputClass}
            required
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="interestedIn" className={labelClass}>
              Interested In
            </label>
            <div className="relative">
              <select
                id="interestedIn"
                value={form.interestedIn}
                onChange={(e) => update("interestedIn", e.target.value)}
                className={`${inputClass} appearance-none pr-10`}
                required
              >
                <option value="">Select Interest</option>
                {INTEREST_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                ▼
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="expectedSalary" className={labelClass}>
              Expected Salary
            </label>
            <div className="relative">
              <select
                id="expectedSalary"
                value={form.expectedSalary}
                onChange={(e) => update("expectedSalary", e.target.value)}
                className={`${inputClass} appearance-none pr-10`}
                required
              >
                <option value="">Select Salary Range</option>
                {EXPECTED_SALARY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                ▼
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
            {error}
            {error.includes("already taken") && (
              <>
                {" "}
                <Link href="/login" className="font-semibold underline">
                  Login instead
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
          {loading ? "Submitting..." : "Submit & Start Predicting"}
        </button>

        <Link
          href="/login"
          className="mt-4 block w-full rounded-lg border-[1.5px] border-[#1a2b4b] bg-white py-3.5 text-center text-[11px] font-bold uppercase tracking-wide text-[#1a2b4b] transition-colors hover:bg-slate-50"
        >
          Already Participated? Submit Prediction
        </Link>
      </form>
      </div>
    </div>
  );
}
