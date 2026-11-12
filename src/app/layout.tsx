import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dibba Sports & Cultural Club | نادي دبا الرياضي الثقافي",
    template: "%s | Dibba SCC",
  },
  description:
    "Official digital platform of Dibba Sports & Cultural Club (Est. 1967), Dibba Al Fujairah, UAE.",
  icons: {
    icon: "/assets/cropped-cropped-glossly-logo-4-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${ibmArabic.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F7FA] text-[#071426]">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
