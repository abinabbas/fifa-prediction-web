import Link from "next/link";

export function LaunchpadFooter() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
                <span className="text-white text-xs font-black">L</span>
              </div>
              <span className="font-black text-navy tracking-widest text-sm">DATAMERIS LAUNCHPAD</span>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Empowering the next generation of digital marketers through football prediction contests.
            </p>
            <div className="flex gap-3">
              {["f", "in", "ig"].map((s) => (
                <div
                  key={s}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs font-bold text-muted"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="label-upper mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/home?section=how-it-works" className="hover:text-navy">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/home?section=predict" className="hover:text-navy">
                  Leaderboard and Rules
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="label-upper mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><span className="text-muted">About Us</span></li>
              <li><span className="text-muted">Our Courses</span></li>
              <li><span className="text-muted">Careers</span></li>
            </ul>
          </div>

          <div>
            <h4 className="label-upper mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><span className="text-muted">Privacy Policy</span></li>
              <li><span className="text-muted">Terms of Use</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs text-muted">
          © 2026 Datameris Launchpad. All rights reserved. Built with ❤️ for the Kerala Football Community.
        </div>
      </div>
    </footer>
  );
}
