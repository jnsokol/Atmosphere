import "./globals.css";

export const metadata = {
  title: "Atmosphere",
  description: "Find the hidden links between your mood and your environment.",
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
