import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Quicksand } from "next/font/google";
import { ThemeProvider } from "./providers/ThemeProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import { InstallPrompt } from "./components/InstallPrompt";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hamza Teha | Premium Video Editor Portfolio",
  description:
    "Hamza Teha is a professional video editor crafting cinematic, premium visual stories for brands, creators, and businesses.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Hamza Teha",
    "theme-color": "#0F4545",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable} ${quicksand.variable}`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <InstallPrompt />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
