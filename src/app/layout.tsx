import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { PortfolioProvider } from "@/context/PortfolioContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import FilmGrain from "@/components/FilmGrain";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
  });

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
  });

export const metadata: Metadata = {
  title: "The Filmox | Love Stories in Motion",
  description: "Premium pre-wedding and wedding cinematography.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable}`}>
        <PortfolioProvider>
          <CustomCursor />
          <FilmGrain />
          <Navigation />
          <main style={{ minHeight: 'calc(100vh - var(--nav-height) - 200px)' }}>
            {children}
          </main>
          <Footer />
        </PortfolioProvider>
      </body>
    </html>
  );
}

