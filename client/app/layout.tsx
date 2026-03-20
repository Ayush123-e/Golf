import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Navigation from "../components/navigation/Navigation";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GolfHero | Premium Golf Platform",
  description: "Join the elite golf community, track your rolling 5 scores, and win big.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.className} min-h-full bg-black text-white flex flex-col`}>
        <ThemeProvider>
          <Navigation />
          <main className="md:ml-64 flex-1 pb-24 md:pb-0">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
