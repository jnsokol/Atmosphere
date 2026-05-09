import "./globals.css";

export const metadata = {
  title: "Atmosphere",
  description: "Find the hidden links between your mood and your environment.",
  manifest: "/manifest.json",
  themeColor: "#1a1d2e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Atmosphere",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1d2e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-atmosphere-night text-white antialiased">
        {children}
      </body>
    </html>
  );
}
