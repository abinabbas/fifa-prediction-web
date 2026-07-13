"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Target, Wallet, ChevronDown, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const labelClass =
  "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a2b4b] mb-1.5";

const inputClass =
  "block w-full px-3.5 py-[11px] border border-[#dde3ec] rounded-lg bg-white text-sm text-slate-800 placeholder:text-[#b0bac8] focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/15 transition-all";

const INTEREST_OPTIONS = ["Digital Marketing", "Coding", "Cybersecurity", "Data Science", "Other"];
const EXPECTED_SALARY_OPTIONS = ["Upto 25000", "25000 to 50000", "Above 50000"];

export function RegisterForm({
  onSuccessRedirect = "/home",
  submitLabel = "Register Now",
  onSwitchTab,
}: {
  onSuccessRedirect?: string;
  submitLabel?: string;
  onSwitchTab?: () => void;
}) {
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
    <form onSubmit={handleSubmit}>

      {/* Row 1 — Full Name & Mobile */}
      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-fullName" className={labelClass}>
            <User className="h-3 w-3 text-[#f97316]" />
            Full Name
          </label>
          <input
            id="reg-fullName"
            type="text"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Enter your name"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label htmlFor="reg-phone" className={labelClass}>
            <Phone className="h-3 w-3 text-[#f97316]" />
            Mobile Number
          </label>
          <input
            id="reg-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 00000 00000"
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Row 2 — Email */}
      <div className="mb-5">
        <label htmlFor="reg-email" className={labelClass}>
          <Mail className="h-3 w-3 text-[#f97316]" />
          Email Address
        </label>
        <input
          id="reg-email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="yourname@email.com"
          className={inputClass}
          required
        />
      </div>

      {/* Row 3 — Interest & Salary */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-interestedIn" className={labelClass}>
            <Target className="h-3 w-3 text-[#f97316]" />
            Interested In
          </label>
          <div className="relative">
            <select
              id="reg-interestedIn"
              value={form.interestedIn}
              onChange={(e) => update("interestedIn", e.target.value)}
              className={`${inputClass} appearance-none pr-9`}
              required
            >
              <option value="">Select Interest</option>
              {INTEREST_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f97316]" />
          </div>
        </div>
        <div>
          <label htmlFor="reg-expectedSalary" className={labelClass}>
            <Wallet className="h-3 w-3 text-[#f97316]" />
            Expected Salary
          </label>
          <div className="relative">
            <select
              id="reg-expectedSalary"
              value={form.expectedSalary}
              onChange={(e) => update("expectedSalary", e.target.value)}
              className={`${inputClass} appearance-none pr-9`}
              required
            >
              <option value="">Select Salary Range</option>
              {EXPECTED_SALARY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f97316]" />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {error}
          {error.includes("already taken") && (
            <>
              {" "}
              {onSwitchTab ? (
                <button type="button" onClick={onSwitchTab} className="font-semibold underline">
                  Login instead
                </button>
              ) : (
                <Link href="/login" className="font-semibold underline">Login instead</Link>
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
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>⚽ {submitLabel} ⚽</>
          )}
        </span>
      </button>

    </form>
  );
}
