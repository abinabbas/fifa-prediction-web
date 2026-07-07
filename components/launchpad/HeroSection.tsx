"use client";

import Image from "next/image";

const HERO_IMAGE =
  "https://res.cloudinary.com/delrmm6pq/image/upload/v1783425648/Landing_Page_Banner_2.0_org_v6fqs5.webp";

export function HeroSection() {
  const scrollToPredict = () => {
    document.getElementById("predict")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="prizes" className="relative w-full bg-[#0f172a]">
      <div className="relative w-full aspect-[16/7] min-h-[220px] max-h-[560px] sm:aspect-[21/9] sm:min-h-[300px]">
        <Image
          src={HERO_IMAGE}
          alt="Free Kick Start Challenge - FIFA prediction contest"
          fill
          priority
          className="object-cover object-[72%_center] sm:object-center"
          sizes="100vw"
        />

        {/* Aligned to the bottom of the AI-Integrated prize card on the banner */}
        <div className="absolute right-[4%] sm:right-[7%] lg:right-[9%] top-[34%] sm:top-[32%] h-[24%] sm:h-[26%] w-[34%] sm:w-[28%] lg:w-[24%] max-w-[300px] min-w-[110px] flex flex-col justify-end">
          <button
            type="button"
            onClick={scrollToPredict}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-wide px-2 sm:px-4 py-1.5 sm:py-2.5 md:py-3 rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-colors"
          >
            Predict Now
          </button>
        </div>
      </div>
    </section>
  );
}
