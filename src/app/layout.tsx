import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { AskMeWidget } from "@/components/AskMeWidget";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getLocaleFromCookies } from "@/lib/auth";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "ALTEREGO OS — HIVE Check-In",
  description:
    "The check-in for your entrepreneurial future. HIVE Business Accelerator onboarding powered by ALTEREGO OS.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
  themeColor: "#F5A623",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocaleFromCookies();
  return (
    <html lang={locale} className={playfair.variable}>
      <body className="honeycomb-bg">
        <I18nProvider initialLocale={locale}>
          <div className="relative z-10">{children}</div>
          <AskMeWidget />
        </I18nProvider>
      </body>
    </html>
  );
}
