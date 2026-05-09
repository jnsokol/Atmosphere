import "./globals.css";
import { Inter, Syne } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const syne  = Syne({ subsets: ["latin"], variable: "--font-syne",  display: "swap" });

export const metadata = {
  title: "Atmosphere",
  description: "Find the hidden links between your mood and your environment.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Atmosphere",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
