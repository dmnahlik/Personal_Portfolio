import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { portfolio } from "@/data/portfolio";
import "./globals.css";

// Downloaded at build time and served from this site (no Google Fonts request).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://personal-portfolio-86737582063.us-central1.run.app";
const { profile } = portfolio;
const title = `${profile.name} | Portfolio`;
const description = `${profile.name}: ${profile.title} focused on quality, continuous improvement, and Lean Six Sigma.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  authors: [{ name: profile.name }],
  icons: { icon: { url: "/assets/img/favicon.svg", type: "image/svg+xml" } },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    images: [{ url: profile.photo, alt: "Portrait of " + profile.name }],
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // theme_init.js changes the class and data-theme before React loads, so
    // differences on <html> are expected and safe to ignore.
    <html lang="en" className={`no-js ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Must run before first paint to avoid a light/dark flash, so it is a
            blocking script on purpose (external file keeps the CSP strict). */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme_init.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
