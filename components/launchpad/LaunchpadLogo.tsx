"use client";

import { useState } from "react";
import Link from "next/link";
import { BRAND_LOGO_SRC } from "@/lib/brand";

export function LaunchpadLogo() {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <Link href="/home" className="inline-flex items-center shrink-0">
        <span className="font-black tracking-[0.22em] text-[15px] text-slate-900 uppercase select-none">
          L
          <span className="relative inline-block">
            A
            <span className="absolute top-[0.42em] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#f97316]" />
          </span>
          UNCHPAD
        </span>
      </Link>
    );
  }

  return (
    <Link href="/home" className="inline-flex items-center shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_LOGO_SRC}
        alt="Datameris Launchpad"
        onError={() => setImgError(true)}
        className="block h-8 sm:h-9 w-auto max-w-[min(60vw,240px)] object-contain object-left"
      />
    </Link>
  );
}
