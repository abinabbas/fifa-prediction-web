import type { Metadata } from "next";
import Script from "next/script";
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

const GTM_ID = "GTM-T352FM9C";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable} h-full antialiased`}>
      <Script id="google-tag-manager" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <body className="min-h-full flex flex-col font-sans">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
