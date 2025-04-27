import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from '@next/third-parties/google';
import Navbar from "@/components/ui/navbar";

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
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-zinc-50`}>
        {/* Main container with max width */}
        <div className="mx-auto max-w-[390px] min-h-screen bg-white relative">
          
          {/* Scrollable content area with padding for navbar */}
          <main className="pb-16 min-h-[calc(100vh-4rem)] overflow-y-auto">
            {children}
          </main>

          {/* Fixed navbar container */}
          <div className="fixed bottom-0 w-full max-w-[390px] h-16 bg-[#2154C5] z-50">
            <Navbar />
          </div>
          
          <Toaster />
        </div>

        <GoogleAnalytics gaId="G-X7GBE88P0J" />
      </body>
    </html>
  );
}