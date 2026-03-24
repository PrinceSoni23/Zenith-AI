import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { RootLayoutWrapper } from "@/components/RootLayoutWrapper";

export const metadata: Metadata = {
  title: "Zenith | AI Learning Companion for Students",
  description:
    "Zenith — AI-powered learning companion for students from Nursery to Class 12. 11 intelligent modules to help you study smarter.",
  keywords: ["Zenith", "AI learning", "study", "education", "CBSE", "ICSE"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Favicon (SVG) - fallback compatible tags */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.svg" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            <RootLayoutWrapper>{children}</RootLayoutWrapper>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
