import type { Metadata, Viewport } from "next";
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
    default: "LaunchLift Practice App",
    template: "%s · LaunchLift Practice App",
  },
  description: "Learn LaunchLiftAI with repeatable practice runs before connecting your real app.",
  applicationName: "LaunchLift Practice App",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LiftLab",
  },
  openGraph: {
    title: "LaunchLift Practice App",
    description: "Learn the launch flow safely with repeatable disposable test runs.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "A preserved LaunchLift practice template creating repeatable test runs." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchLift Practice App",
    description: "Learn the launch flow safely with repeatable disposable test runs.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#071a24",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
