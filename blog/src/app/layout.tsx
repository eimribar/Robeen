import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Robeen Journal | Science-backed Parenting Advice",
    template: "%s | Robeen",
  },
  description: "We translate complex pediatric research into simple, actionable guides optimized for your busy life. Science-backed answers for modern parents.",
  keywords: ["baby", "parenting", "sleep science", "newborn", "infant care", "baby sleep", "feeding guide"],
  authors: [{ name: "Robeen" }],
  creator: "Robeen AI",
  publisher: "Robeen",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://robeen.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Robeen Journal",
    title: "Robeen Journal | Science-backed Parenting Advice",
    description: "We translate complex pediatric research into simple, actionable guides optimized for your busy life.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robeen Journal | Science-backed Parenting Advice",
    description: "We translate complex pediatric research into simple, actionable guides optimized for your busy life.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
