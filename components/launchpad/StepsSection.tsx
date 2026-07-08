import { UserPlus, Volleyball, Trophy } from "lucide-react";
import { PageContainer } from "@/components/launchpad/PageContainer";

const iconClass = "w-6 h-6 md:w-10 md:h-10 text-[#1e293b] stroke-[1.75]";

const steps = [
  {
    num: 1,
    Icon: UserPlus,
    title: "Register Profile",
    desc: "Create your free account with basic details like name, college and district.",
  },
  {
    num: 2,
    Icon: Volleyball,
    title: "Make Predictions",
    desc: "Submit your match analysis for knockout games before each kickoff.",
  },
  {
    num: 3,
    Icon: Trophy,
    title: "Win Professional Course",
    desc: "Top 10 leaderboard participants earn full career scholarships.",
  },
];

export function StepsSection() {
  return (
    <section className="py-8 sm:py-20 bg-[#f8f9fa]" id="how-it-works">
      <PageContainer>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-8 md:mb-16">
          Start in 3 Simple Steps
        </h2>

        <div className="relative w-full">
          <div
            className="absolute top-[28px] md:top-[52px] left-[calc(100%/6)] right-[calc(100%/6)] border-t-2 border-dashed border-slate-300 z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-3 gap-3 md:gap-6 w-full">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="relative mb-3 md:mb-6 z-10">
                  <span className="absolute -top-1.5 -left-1.5 md:-top-2 md:-left-2 z-20 w-5 h-5 md:w-7 md:h-7 rounded-md bg-[#f97316] text-white text-[10px] md:text-sm font-bold flex items-center justify-center shadow-sm">
                    {step.num}
                  </span>
                  <div className="w-14 h-14 md:w-[104px] md:h-[104px] bg-white border border-slate-200 rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                    <step.Icon className={iconClass} aria-hidden="true" />
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-xs sm:text-sm md:text-lg mb-0 md:mb-2 px-1 md:px-2 leading-snug">
                  {step.title}
                </h3>
                <p className="hidden md:block text-sm text-slate-500 leading-relaxed max-w-[220px] px-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
