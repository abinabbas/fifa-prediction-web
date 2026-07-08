import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { BRAND_APPLE_ICON_SRC, BRAND_FAVICON_SRC } from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: ["800"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: "LAUNCHPAD — FIFA World Cup 2026 Prediction Contest",
  description: "Predict. Win. Launch Your Career. FIFA World Cup 2026 Prediction Contest by Datameris Launchpad.",
  icons: {
    icon: [{ url: BRAND_FAVICON_SRC, type: "image/png" }],
    shortcut: [{ url: BRAND_FAVICON_SRC, type: "image/png" }],
    apple: [{ url: BRAND_APPLE_ICON_SRC, type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
