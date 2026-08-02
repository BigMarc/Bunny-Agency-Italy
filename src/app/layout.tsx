import type { Metadata } from "next";
import { Bodoni_Moda, Mulish } from "next/font/google";
import { absoluteUrl, content } from "@/lib/content";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import LegacyHashBridge from "@/components/LegacyHashBridge";
import SiteJsonLd from "@/components/SiteJsonLd";
import GoldDust from "@/components/GoldDust";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Mulish({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: { default: content.site.name, template: "%s" },
  description: content.site.description,
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="it" dir="ltr" className={`${display.variable} ${body.variable}`}><body><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} /><LegacyHashBridge /><SiteJsonLd /><GoldDust /><div className="frame-vignette" aria-hidden="true" /><SiteHeader /><main>{children}</main><SiteFooter /></body></html>;
}
