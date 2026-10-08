import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neon Tickets | Cyberpunk Concerts",
  description: "Your gateway to the best live experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main className="page-container">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
