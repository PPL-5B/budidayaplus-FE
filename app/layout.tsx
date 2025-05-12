import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from '@next/third-parties/google';
import NavbarWrapper from "@/components/ui/NavbarWrapper"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BudidayaPlus",
  description: "A simple web app for managing your aquaculture business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen">
      <body className={`${inter.className} bg-zinc-50 min-h-screen`}>
        <div className="mx-auto max-w-[390px] min-h-screen bg-[#EDF2FF] flex flex-col relative">
          <main className="flex-grow pb-20">
            {children}
          </main>

          <NavbarWrapper />
          <Toaster />
        </div>

        <GoogleAnalytics gaId="G-X7GBE88P0J" />
      </body>
    </html>
  );
}