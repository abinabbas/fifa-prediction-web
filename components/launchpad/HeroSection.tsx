"use client";

import Image from "next/image";

const HERO_IMAGE =
  "https://res.cloudinary.com/delrmm6pq/image/upload/v1783425648/Landing_Page_Banner_2.0_org_v6fqs5.webp";

interface HeroSectionProps {
  ctaLabel?: string;
  scrollTargetId?: string;
}

export function HeroSection({
  ctaLabel = "Predict Now",
  scrollTargetId = "predict",
}: HeroSectionProps) {
  const handleCta = () => {
    document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="prizes" className="relative w-full bg-[#0f172a]">
      <div className="relative w-full aspect-[16/9] sm:aspect-[2400/855]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={HERO_IMAGE}
            alt="Free Kick Start Challenge - FIFA prediction contest"
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 overflow-hidden">
          {/* Left: FREE KICK START CHALLENGE */}
          <div className="absolute left-[6%] sm:left-[8%] lg:left-[10%] top-[18%] sm:top-[21%] lg:top-[24%] pointer-events-none w-[min(75%,42vw)] max-w-[34rem]">
            <div className="hero-title-block">
              <div className="hero-title-lines">
                <p className="hero-kickstart-line">FREE</p>
                <p className="hero-kickstart-line">KICK</p>
                <p className="hero-kickstart-line">START</p>
              </div>
              <div className="hero-challenge-banner bg-[#f97316]">
                <span className="hero-challenge-text">CHALLENGE</span>
              </div>
            </div>
          </div>

          {/* Right: Prize card */}
          <div className="absolute right-[2%] sm:right-[5%] lg:right-[8%] bottom-[2%] sm:bottom-[4%] lg:bottom-[5%] w-[clamp(9rem,44vw,25rem)]">
            <div className="relative bg-white rounded-md sm:rounded-xl border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.2)] pt-[clamp(0.75rem,3vw,1.5rem)] pb-[clamp(0.375rem,1.8vw,1rem)] px-[clamp(0.375rem,2.2vw,1.25rem)]">
              <span className="absolute -top-[clamp(0.4rem,1.2vw,0.75rem)] left-1/2 -translate-x-1/2 bg-[#f97316] text-white text-[clamp(0.45rem,1.6vw,0.6875rem)] font-bold uppercase tracking-wider px-[clamp(0.375rem,1.5vw,0.875rem)] py-[clamp(0.1rem,0.4vw,0.25rem)] rounded-full whitespace-nowrap">
                Prize
              </span>

              <div className="flex items-stretch gap-[clamp(0.25rem,1.5vw,1rem)] mt-[clamp(0.25rem,1vw,0.625rem)]">
                <p className="flex-1 text-[clamp(0.45rem,2.1vw,1rem)] font-bold text-[#1e293b] leading-snug">
                  <span className="text-[#f97316]">FREE</span> AI-Integrated Digital Marketing
                  Mentorship Program
                </p>
                <div className="w-px bg-slate-200 shrink-0" aria-hidden="true" />
                <p className="shrink-0 text-[clamp(0.45rem,2.2vw,1.125rem)] font-extrabold text-[#1e3a5f] leading-tight self-center">
                  Worth
                  <br />
                  <span className="text-[clamp(0.625rem,3.2vw,1.5rem)]">₹ 1.5 Lakh</span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleCta}
                className="mt-[clamp(0.375rem,1.5vw,1rem)] w-full bg-[#f97316] hover:bg-[#ea580c] text-white text-[clamp(0.45rem,2vw,1rem)] font-bold uppercase tracking-wide px-[clamp(0.375rem,2vw,1.25rem)] py-[clamp(0.3rem,1.4vw,0.75rem)] rounded-sm sm:rounded-md shadow-[0_4px_12px_rgba(249,115,22,0.35)] transition-colors"
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
