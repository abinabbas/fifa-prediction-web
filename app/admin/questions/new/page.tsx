"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { LaunchpadHeader } from "@/components/launchpad/LaunchpadHeader";
import { LaunchpadFooter } from "@/components/launchpad/LaunchpadFooter";
import { DateTimePicker } from "@/components/launchpad/DateTimePicker";

export default function NewQuestionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("Who will win?");
  const [options, setOptions] = useState(["Team A WIN", "DRAW", "Team B WIN"]);
  const [closesAt, setClosesAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/admin/login");
      else if (user.role !== "admin") router.push("/");
    }
  }, [authLoading, user, router]);

  const addOption = () => { if (options.length < 6) setOptions([...options, ""]); };
  const removeOption = (i: number) => { if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i)); };
  const updateOption = (i: number, val: string) => { const n = [...options]; n[i] = val; setOptions(n); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const filled = options.filter((o) => o.trim());
    if (filled.length < 2) { setError("Please provide at least 2 options"); setLoading(false); return; }

    if (!closesAt) {
      setError("Please select when predictions close");
      setLoading(false);
      return;
    }

    try {
      await api.createQuestion({
        title,
        options: filled.map((label) => ({ label: label.trim() })),
        closesAt,
      });
      router.push("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LaunchpadHeader showNav={false} />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full">
        <Link href="/admin" className="text-sm text-orange font-semibold hover:underline mb-6 inline-block">
          ← Back to dashboard
        </Link>

        <div className="launchpad-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white">+</div>
            <h1 className="text-xl font-black text-navy">Add Prediction Question</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-upper block mb-1.5">Today&apos;s Question</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required />
            </div>

            <div>
              <label className="label-upper block mb-2">Options</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} className="input-field" />
                    {options.length > 2 && (
                      <button type="button" onClick={() => removeOption(i)} className="px-3 rounded-lg border border-border text-muted hover:bg-background">✕</button>
                    )}
                  </div>
                ))}
              </div>
              {options.length < 6 && (
                <button type="button" onClick={addOption} className="mt-2 text-sm text-orange font-semibold hover:underline">+ Add option</button>
              )}
            </div>

            <DateTimePicker
              label="Prediction closes at"
              value={closesAt}
              onChange={setClosesAt}
              required
            />

            {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>}

            <button type="submit" disabled={loading} className="btn-navy w-full py-4 text-sm disabled:opacity-50">
              {loading ? "Creating..." : "Create Question"}
            </button>
          </form>
        </div>
      </main>

      <LaunchpadFooter />
    </div>
  );
}
