import ThemeProvider from "../components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
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
      <html lang="en" className="h-full" suppressHydrationWarning>
        <head>
          <Script id="bucket-theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `try { var theme = localStorage.getItem('bucket-theme') === 'dark' ? 'dark' : 'light'; document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; } catch (_) {}` }} />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-K0HVES6VM5"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-K0HVES6VM5');
              `,
            }}
          />
        </head>
        {/* Grammarly can add body attributes before React hydrates. */}
        <body
          suppressHydrationWarning
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-transparent`}
        >
          <ClerkProvider
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            signInFallbackRedirectUrl="/generate"
            signUpFallbackRedirectUrl="/generate"
            afterSignOutUrl="/"
          >
            <AppRouterCacheProvider>
              <ThemeProvider><div className="app-theme">{children}</div></ThemeProvider>
              <Analytics />
            </AppRouterCacheProvider>
          </ClerkProvider>
        </body>
      </html>
  );
}
