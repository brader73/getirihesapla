import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { MarketProvider } from "@/context/MarketContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const crimsonPro = Crimson_Pro({ subsets: ["latin"], variable: "--font-crimson-pro" });

export const metadata: Metadata = {
  title: "GetiriHesapla.com | Finansal Hesaplama Terminali",
  description: "Profesyonel yatırım ve finans hesaplama terminali",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#b45309",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} ${crimsonPro.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300`}>
        <MarketProvider>
          {children}
        </MarketProvider>
      </body>
    </html>
  );
}
