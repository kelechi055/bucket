import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "bucket",
  description: "Your AI-Powered Bucket-list Generator",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <GoogleAnalytics gaID="G-4723HGXF68" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent`}>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}