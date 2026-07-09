import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7h2.8z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

const socials = [
  {
    label: "Facebook",
    Icon: FacebookIcon,
    href: "https://www.facebook.com/people/Datameris-Launchpad/61584018385137/",
  },
  {
    label: "Instagram",
    Icon: InstagramIcon,
    href: "https://www.instagram.com/datameris_launchpad/?hl=en",
  },
  {
    label: "YouTube",
    Icon: YoutubeIcon,
    href: "https://www.youtube.com/@DatamerisLaunchpad",
  },
  {
    label: "LinkedIn",
    Icon: LinkedinIcon,
    href: "https://www.linkedin.com/company/datameris-launchpad",
  },
];

const quickLinks = [
  { label: "How it Works", href: "/home#how-it-works" },
  { label: "Prize", href: "/home#prize" },
  { label: "Predict", href: "/home#predict" },
];

export function LaunchpadFooter() {
  return (
    <footer className="mt-auto" style={{ backgroundColor: "#312e81" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/delrmm6pq/image/upload/e_trim,w_480,c_limit,q_auto,f_auto/v1783513586/WhatsAppImage2026-06-15at5.12.00PM_pnvatj.webp"
              alt="Datameris Launchpad"
              width={460}
              height={100}                                                                                                                                                                                                                                                                                                                                                                                                                                                  
              className="h-7 sm:h-8 w-auto object-contain mb-4"
            />
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>
              Bridging the gap between academic learning and real industry expectations through
              mentorship, practical execution, and career-focused learning experiences.
            </p>
            <div className="flex gap-3">
              {socials.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors hover:brightness-125"
                  style={{ backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.12em] mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label} className="flex items-center gap-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.45)" }}
                    aria-hidden="true"
                  />
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-[0.12em] mb-5">
              Contact Information
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" style={{ color: "#f97316" }} />
                <a
                  href="tel:+917994447500"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  +91 79944 47500
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" style={{ color: "#f97316" }} />
                <a
                  href="mailto:hello@datameris.com"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  hello@datameris.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "#f97316" }} />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Kochi, Kerala · Online + Offline
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}
        >
          © 2026 Datameris Launchpad. All Rights Reserved. Built with{" "}
          <span style={{ color: "#ef4444" }}>❤️</span> for the Kerala Football Community.
        </div>
      </div>
    </footer>
  );
}
