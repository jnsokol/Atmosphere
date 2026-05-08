import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atmosphere",
  description: "Find the hidden links between your mood and your environment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-atmosphere-night text-white antialiased">
        {children}
      </body>
    </html>
  );
}
