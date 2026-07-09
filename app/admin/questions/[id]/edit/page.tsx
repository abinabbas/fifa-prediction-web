"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { LaunchpadHeader } from "@/components/launchpad/LaunchpadHeader";
import { LaunchpadFooter } from "@/components/launchpad/LaunchpadFooter";
import {
  QuestionFormFields,
  type QuestionOptionRow,
} from "@/components/launchpad/QuestionFormFields";
import { toApiOptions } from "@/lib/questionForm";

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState<QuestionOptionRow[]>([]);
  const [closesAt, setClosesAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/admin/login");
      else if (user.role !== "admin") router.push("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.role !== "admin" || !questionId) return;

    setFetching(true);
    api
      .getAdminQuestion(questionId)
      .then((res) => {
        setTitle(res.question.title);
        setOptions(
          res.question.options.map((option) => ({
            id: option.id,
            label: option.label,
            flagIso: option.flagIso || "",
          }))
        );
        setClosesAt(res.question.closesAt);
      })
      .catch(() => setError("Failed to load question"))
      .finally(() => setFetching(false));
  }, [user, questionId]);

  const addOption = () => {
    if (options.length < 6) setOptions([...options, { label: "", flagIso: "" }]);
  };

  const removeOption = (i: number) => {
    if (options.length > 2) setOptions(options.filter((_, idx) => idx !== i));
  };

  const updateOption = (i: number, field: keyof QuestionOptionRow, val: string) => {
    const next = [...options];
    next[i] = { ...next[i], [field]: val };
    setOptions(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const filled = options.filter((option) => option.label.trim());
    if (filled.length < 2) {
      setError("Please provide at least 2 options");
      setLoading(false);
      return;
    }

    if (!closesAt) {
      setError("Please select when predictions close");
      setLoading(false);
      return;
    }

    try {
      await api.updateQuestion(questionId, {
        title,
        options: toApiOptions(filled),
        closesAt,
      });
      router.push("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update question");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
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
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-white">✎</div>
            <h1 className="text-xl font-black text-navy">Edit Prediction Question</h1>
          </div>

          {fetching ? (
            <p className="text-muted text-center py-8">Loading question...</p>
          ) : (
            <QuestionFormFields
              title={title}
              options={options}
              closesAt={closesAt}
              error={error}
              loading={loading}
              submitLabel="Save Changes"
              onTitleChange={setTitle}
              onClosesAtChange={setClosesAt}
              onOptionChange={updateOption}
              onAddOption={addOption}
              onRemoveOption={removeOption}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </main>

      <LaunchpadFooter />
    </div>
  );
}
