import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cinzel_Decorative } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "@/components/i18n-provider";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Gyst - Your Life, Organized",
  description: "Art Nouveau-inspired life organizer with task management, streaks, and AI-powered suggestions",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gyst",
    startupImage: [
      {
        url: "/splash/apple-splash-2048-2732.png",
        media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/splash/apple-splash-1668-2388.png",
        media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/splash/apple-splash-1536-2048.png",
        media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/splash/apple-splash-1170-2532.png",
        media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/splash/apple-splash-1125-2436.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  applicationName: "Gyst",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// Art Nouveau Typography System
const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  display: "swap",
  subsets: ["latin"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-ornamental",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfairDisplay.variable} ${inter.variable} ${cinzelDecorative.variable}`}>
      <body className="antialiased font-body">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
            <InstallPrompt />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
