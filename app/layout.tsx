import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./providers";
import Navigation from "@/components/Navigation";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const metadata: Metadata = {
  title: "OpenCamp",
  description: "OpenCamp Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased bg-[var(--app-bg)] text-[var(--text-1)]`}
        >
          <ConvexClientProvider>
            <ToastProvider>
              <Navigation />
              {children}
            </ToastProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
