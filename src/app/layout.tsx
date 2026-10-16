import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";
import "@/styles/globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Cursor, MotionPanel, MotionProvider } from "@/components/motion";
import { profile } from "@/data/profile";
import { SITE_URL } from "@/lib/site";
import { jsonLdString, personJsonLd } from "@/lib/seo";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  // Origin only: Next adds basePath to metadata image paths itself.
  metadataBase: new URL(new URL(SITE_URL).origin),
  title: { default: profile.seo.title, template: `%s` },
  description: profile.seo.description,
  authors: [{ name: profile.name }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: profile.seo.title,
    description: profile.seo.ogDescription,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: profile.seo.title, description: profile.seo.ogDescription },
};

export const viewport: Viewport = { themeColor: "#0b0b0f", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${newsreader.variable}`}
      data-motion="on"
      data-cursor="off"
    >
      <head>
        {/* Without JS, reveal-animated content must be visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(personJsonLd()) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed top-4 left-4 z-[200] rounded-full bg-[var(--color-text)] px-4 py-2 font-[family-name:var(--font-display)] font-semibold text-[var(--color-bg)]"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Nav />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <MotionPanel />
          <Cursor />
        </MotionProvider>
      </body>
    </html>
  );
}
