"use client";

import { DateTimePicker } from "@/components/launchpad/DateTimePicker";
import { getFlagImageUrl, TEAM_FLAGS } from "@/lib/teamFlags";

export interface QuestionOptionRow {
  id?: string;
  label: string;
  flagIso: string;
}

interface QuestionFormFieldsProps {
  title: string;
  options: QuestionOptionRow[];
  closesAt: string;
  error: string;
  loading: boolean;
  submitLabel: string;
  onTitleChange: (value: string) => void;
  onClosesAtChange: (value: string) => void;
  onOptionChange: (index: number, field: keyof QuestionOptionRow, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function QuestionFormFields({
  title,
  options,
  closesAt,
  error,
  loading,
  submitLabel,
  onTitleChange,
  onClosesAtChange,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onSubmit,
}: QuestionFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="label-upper block mb-1.5">Today&apos;s Question</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="label-upper block mb-2">Options</label>
        <p className="text-xs text-muted mb-3">
          Select a team flag for team options. Flags appear in the homepage marquee.
        </p>
        <div className="space-y-3">
          {options.map((opt, i) => (
            <div key={opt.id ?? i} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={opt.label}
                onChange={(e) => onOptionChange(i, "label", e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="input-field flex-1"
              />
              <div className="relative sm:w-56 shrink-0">
                <select
                  value={opt.flagIso}
                  onChange={(e) => onOptionChange(i, "flagIso", e.target.value)}
                  className="input-field appearance-none pr-10"
                >
                  <option value="">No flag</option>
                  {TEAM_FLAGS.map((team) => (
                    <option key={team.iso} value={team.iso}>
                      {team.code} — {team.name}
                    </option>
                  ))}
                </select>
                {opt.flagIso ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getFlagImageUrl(opt.flagIso)}
                    alt=""
                    className="pointer-events-none absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full object-cover"
                  />
                ) : null}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
                  ▼
                </span>
              </div>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => onRemoveOption(i)}
                  className="px-3 rounded-lg border border-border text-muted hover:bg-background sm:self-stretch"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 6 && (
          <button type="button" onClick={onAddOption} className="mt-2 text-sm text-orange font-semibold hover:underline">
            + Add option
          </button>
        )}
      </div>

      <DateTimePicker label="Prediction closes at" value={closesAt} onChange={onClosesAtChange} required />

      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>}

      <button type="submit" disabled={loading} className="btn-navy w-full py-4 text-sm disabled:opacity-50">
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
