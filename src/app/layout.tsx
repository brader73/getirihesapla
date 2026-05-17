import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { MarketProvider } from "@/context/MarketContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const crimsonPro = Crimson_Pro({ subsets: ["latin"], variable: "--font-crimson-pro" });

export const metadata: Metadata = {
  title: "KorfuFinance | Profesyonel Analiz",
  description: "Profesyonel yatırım ve finans hesaplama terminali.",
  keywords: ["finans", "borsa", "kripto", "yatırım", "analiz", "korfufinance"],
  manifest: "/manifest.json",
  icons: {
    icon: '/korfu_favicon.svg',
    apple: '/korfu_app_icon.svg',
  },
  openGraph: {
    title: "KorfuFinance | Profesyonel Analiz",
    description: "Profesyonel yatırım ve finans hesaplama terminali.",
    url: "https://www.korfufinance.com",
    siteName: "KorfuFinance",
    images: [
      {
        url: "/korfu_app_icon.svg",
        width: 1024,
        height: 1024,
        alt: "KorfuFinance",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KorfuFinance",
    description: "Profesyonel yatırım ve finans hesaplama terminali.",
    images: ["/korfu_app_icon.svg"],
  },
};

export const viewport = {
  themeColor: "#0f172a",
};

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import LoadingScreen from "@/components/layout/LoadingScreen";
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
        <LoadingScreen />
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
