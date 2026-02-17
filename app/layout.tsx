import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemeAI — AI-Powered Meme Generator",
  description:
    "Create hilarious, viral-worthy memes in seconds using AI. Powered by fal.ai × FLUX. Generate, caption, and download memes instantly.",
  keywords: ["meme generator", "AI memes", "fal.ai", "FLUX", "meme maker"],
  openGraph: {
    title: "MemeAI — AI-Powered Meme Generator",
    description: "Create hilarious memes in seconds using AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
