import Link from "next/link";

export function LaunchpadLogo() {
  return (
    <Link href="/home" className="inline-flex items-center">
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
