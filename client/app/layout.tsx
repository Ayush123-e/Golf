import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import PremiumBackground from "../components/ui/PremiumBackground";
import MainLayout from "../components/navigation/MainLayout";
import { createClient } from "@/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GolfHero | Premium Golf Platform",
  description: "Join the elite golf community, track your rolling 5 scores, and win big.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  } catch (err) {
    console.error("Auth check failed:", err);
  }

  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.className} min-h-full bg-black text-white flex flex-col`}>
        <ThemeProvider>
          <PremiumBackground />
          <MainLayout user={user}>
            {children}
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
