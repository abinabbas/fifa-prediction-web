"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";

type Period = "AM" | "PM";

interface DateTimePickerProps {
  value: string;
  onChange: (iso: string) => void;
  label?: string;
  required?: boolean;
}

function to24Hour(hour12: number, period: Period): number {
  if (period === "AM") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

function parseIso(iso: string) {
  if (!iso) {
    return {
      date: "",
      hour12: 12,
      minute: 0,
      period: "PM" as Period,
    };
  }

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { date: "", hour12: 12, minute: 0, period: "PM" as Period };
  }

  const hours24 = d.getHours();
  const period: Period = hours24 >= 12 ? "PM" : "AM";
  const hour12 = hours24 % 12 || 12;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    hour12,
    minute: d.getMinutes(),
    period,
  };
}

function buildIso(date: string, hour12: number, minute: number, period: Period): string {
  if (!date) return "";
  const h24 = to24Hour(hour12, period);
  const local = new Date(
    `${date}T${String(h24).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`
  );
  if (Number.isNaN(local.getTime())) return "";
  return local.toISOString();
}

function formatPreview(date: string, hour12: number, minute: number, period: Period) {
  if (!date) return "Select date and time";
  const iso = buildIso(date, hour12, minute, period);
  if (!iso) return "Select date and time";
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function AnalogClock({ hour12, minute, period }: { hour12: number; minute: number; period: Period }) {
  const h24 = to24Hour(hour12, period);
  const hourAngle = ((h24 % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;

  return (
    <div className="relative w-28 h-28 rounded-full border-2 border-[#1a2b4b]/15 bg-gradient-to-b from-white to-slate-50 shadow-inner shrink-0">
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 w-0.5 h-2 bg-slate-300 origin-bottom"
          style={{ transform: `translate(-50%, -100%) rotate(${i * 30}deg) translateY(-46px)` }}
        />
      ))}
      <div
        className="absolute left-1/2 top-1/2 w-1 h-7 bg-[#1a2b4b] rounded-full origin-bottom -translate-x-1/2"
        style={{ transform: `translate(-50%, -100%) rotate(${hourAngle}deg)` }}
      />
      <div
        className="absolute left-1/2 top-1/2 w-0.5 h-9 bg-[#f97316] rounded-full origin-bottom -translate-x-1/2"
        style={{ transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)` }}
      />
      <div className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a2b4b]" />
    </div>
  );
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function DateTimePicker({ value, onChange, label, required }: DateTimePickerProps) {
  const parsed = useMemo(() => parseIso(value), [value]);
  const [date, setDate] = useState(parsed.date);
  const [hour12, setHour12] = useState(parsed.hour12);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState<Period>(parsed.period);

  useEffect(() => {
    setDate(parsed.date);
    setHour12(parsed.hour12);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [parsed.date, parsed.hour12, parsed.minute, parsed.period]);

  const update = (next: Partial<{ date: string; hour12: number; minute: number; period: Period }>) => {
    const d = next.date ?? date;
    const h = next.hour12 ?? hour12;
    const m = next.minute ?? minute;
    const p = next.period ?? period;

    setDate(d);
    setHour12(h);
    setMinute(m);
    setPeriod(p);
    onChange(buildIso(d, h, m, p));
  };

  const selectClass =
    "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:border-[#1a2b4b] focus:ring-2 focus:ring-[#1a2b4b]/10 appearance-none text-center font-semibold";

  return (
    <div>
      {label && (
        <label className="label-upper block mb-1.5">{label}</label>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Date</p>
          <input
            type="date"
            value={date}
            onChange={(e) => update({ date: e.target.value })}
            className="input-field"
            required={required}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#1a2b4b]" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Time</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <AnalogClock hour12={hour12} minute={minute} period={period} />

            <div className="flex-1 w-full space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 mb-1 text-center">Hour</p>
                  <select
                    value={hour12}
                    onChange={(e) => update({ hour12: Number(e.target.value) })}
                    className={selectClass}
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 mb-1 text-center">Minute</p>
                  <select
                    value={minute}
                    onChange={(e) => update({ minute: Number(e.target.value) })}
                    className={selectClass}
                  >
                    {MINUTES.map((m) => (
                      <option key={m} value={m}>
                        {String(m).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-400 mb-1 text-center">AM / PM</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["AM", "PM"] as Period[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update({ period: p })}
                      className={`py-2.5 rounded-lg text-sm font-bold transition-colors ${
                        period === p
                          ? "bg-[#1a2b4b] text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-[#1a2b4b]/30"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm font-medium text-[#1a2b4b] pt-1 border-t border-slate-200">
          {formatPreview(date, hour12, minute, period)}
        </p>
      </div>
    </div>
  );
}
