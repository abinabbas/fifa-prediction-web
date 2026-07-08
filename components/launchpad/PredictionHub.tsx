"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError, type Question, type User } from "@/lib/api";
import { CountdownTimer } from "@/components/CountdownTimer";

interface PredictionHubProps {
  user: User | null;
}

interface QuestionCardProps {
  question: Question;
  serverTime: string;
  prediction: { selectedOptionId: string; createdAt: string } | null;
  onSubmitted: () => void;
}

function QuestionCard({ question, serverTime, prediction, onSubmitted }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(new Date(serverTime) >= new Date(question.closesAt));

  const hasPrediction = !!prediction;
  const isClosed = expired || new Date() >= new Date(question.closesAt);
  const closeTimeLabel = new Date(question.closesAt).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleSubmit = async () => {
    if (!selectedOption) return;
    setSubmitting(true);
    setError("");
    try {
      await api.submitPrediction(question.id, selectedOption);
      setShowConfirm(false);
      onSubmitted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit prediction");
      setShowConfirm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <h3 className="text-lg font-bold text-[#1a2b4b] break-words min-w-0 flex-1">
            {question.title}
          </h3>
          {question.isActive && !isClosed && (
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide bg-yellow-400 text-yellow-900 rounded-full shrink-0">
              Open
            </span>
          )}
        </div>

        <div className="mt-6">
          {hasPrediction ? (
            <div className="p-4 rounded-xl bg-[#1a2b4b]/5 border border-[#1a2b4b]/10 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Your prediction (locked)
              </p>
              <p className="font-bold text-[#1a2b4b] text-base sm:text-lg break-words">
                {question.options.find((o) => o.id === prediction?.selectedOptionId)?.label}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Submitted {new Date(prediction.createdAt).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
                Closed at {closeTimeLabel}
              </p>
            </div>
          ) : isClosed ? (
            <div className="text-center py-4">
              <p className="text-red-500 font-semibold text-sm">Predictions are closed for this question.</p>
              <p className="text-xs text-slate-500 mt-2">Closed at {closeTimeLabel}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 mb-4">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full min-w-0 py-3.5 px-4 rounded-xl border-2 font-semibold text-sm text-left leading-snug transition-all break-words whitespace-normal ${
                      selectedOption === option.id
                        ? "border-[#f97316] bg-[#f97316]/5 text-[#f97316]"
                        : "border-slate-200 bg-white text-[#1a2b4b] hover:border-[#1a2b4b]/30"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="mb-6 py-4 px-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <CountdownTimer
                  closesAt={question.closesAt}
                  serverTime={serverTime}
                  onExpire={() => setExpired(true)}
                />
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Closes {closeTimeLabel}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                disabled={!selectedOption}
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl disabled:opacity-50 transition-colors"
              >
                Confirm prediction
              </button>
            </>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-[#1a2b4b]/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-[#1a2b4b] mb-2">Confirm prediction</h3>
            <p className="text-slate-500 text-sm mb-2">{question.title}</p>
            <p className="text-slate-500 text-sm mb-6 break-words">
              You selected{" "}
              <strong className="text-[#1a2b4b]">
                {question.options.find((o) => o.id === selectedOption)?.label}
              </strong>
              . This cannot be changed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-lg border border-slate-200 text-[#1a2b4b] font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold text-sm disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PredictionHub({ user }: PredictionHubProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [predictions, setPredictions] = useState<
    Record<string, { selectedOptionId: string; createdAt: string }>
  >({});
  const [serverTime, setServerTime] = useState(new Date().toISOString());
  const [fetching, setFetching] = useState(true);

  const fetchQuestions = useCallback(async () => {
    if (!user) {
      setFetching(false);
      return;
    }
    try {
      const res = await api.getOpenQuestions();
      setQuestions(res.questions);
      setPredictions(res.predictions);
      setServerTime(res.serverTime);
    } catch {
      setQuestions([]);
      setPredictions({});
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const submittedCount = Object.keys(predictions).length;

  return (
    <section className="py-16 bg-[#fafafa]" id="predict">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-wider text-center text-[#f97316] mb-2">
          Prediction Hub
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-900 mb-8 sm:mb-10">
          Open predictions
        </h2>

        {!user ? (
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <p className="text-slate-500 mb-6 text-sm">
              Login with your registered mobile number to submit predictions.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors"
            >
              Login to predict
            </Link>
          </div>
        ) : fetching ? (
          <p className="text-center text-slate-500 py-12">Loading predictions...</p>
        ) : questions.length === 0 ? (
          <div className="max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <p className="text-slate-500">No open predictions right now. Check back soon!</p>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-slate-500 mb-6">
              {questions.length} open question{questions.length !== 1 ? "s" : ""}
              {submittedCount > 0 && ` · ${submittedCount} submitted by you`}
            </p>
            <div
              className={
                questions.length === 1
                  ? "max-w-lg mx-auto w-full min-w-0"
                  : "grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0"
              }
            >
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  serverTime={serverTime}
                  prediction={predictions[question.id] ?? null}
                  onSubmitted={fetchQuestions}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
