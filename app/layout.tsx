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
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-zinc-50 h-full`}>
        {/* Main container with max width */}
        <div className="mx-auto max-w-[390px] h-full bg-white relative">
          
          {/* Scrollable content area */}
          <main className="pb-20 min-h-[calc(100vh-5rem)] overflow-y-auto">
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