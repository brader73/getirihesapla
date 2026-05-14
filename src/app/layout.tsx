import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { MarketProvider } from "@/context/MarketContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const crimsonPro = Crimson_Pro({ subsets: ["latin"], variable: "--font-crimson-pro" });

export const metadata: Metadata = {
  title: "Korfu Finance | Profesyonel Finansal Analiz",
  description: "Profesyonel yatırım ve finans hesaplama terminali, borsa, kripto, tahvil ve reel getiri analizleri.",
  keywords: ["finans", "borsa", "kripto", "temettü", "hisse", "yatırım", "analiz"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Korfu Finance | Profesyonel Finansal Analiz",
    description: "Profesyonel yatırım ve finans hesaplama terminali.",
    url: "https://www.korfufinance.com",
    siteName: "Korfu Finance",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Korfu Finance",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Korfu Finance",
    description: "Profesyonel yatırım ve finans hesaplama terminali.",
    images: ["https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"],
  },
};

export const viewport = {
  themeColor: "#b45309",
};

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import TVTicker from "@/components/tradingview/TVTicker";
import { MobileMenuProvider } from "@/context/MobileMenuContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${crimsonPro.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`}>
        <MarketProvider>
          <MobileMenuProvider>
            {/* Ticker at the absolute top */}
            <div className="z-50 relative">
              <TVTicker />
            </div>
            
            <div className="flex h-screen overflow-hidden pt-[46px]"> {/* pt-[46px] to account for TVTicker height */}
              <Sidebar />
              
              <div className="flex-1 flex flex-col w-full md:ml-64 overflow-hidden relative">
                <Header />
                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
                  {children}
                </main>
              </div>
            </div>
          </MobileMenuProvider>
        </MarketProvider>
      </body>
    </html>
  );
}
