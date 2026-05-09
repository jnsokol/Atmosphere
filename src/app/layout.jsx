import "./globals.css";
import { Inter, Syne } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const syne  = Syne({ subsets: ["latin"], variable: "--font-syne",  display: "swap" });

export const metadata = {
  title: "Atmosphere",
  description: "Track your mood. Capture the weather. Find the hidden patterns behind how you feel.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Atmosphere",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b0d18",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-atmosphere-night text-white antialiased">
        {children}
      </body>
    </html>
  );
}
