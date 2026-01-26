import type { Metadata } from "next";
import { Cookie, Outfit } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

const cookie = Cookie({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cookie",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cupid Crochy | Handmade with Love",
  description: "Beautifully handcrafted crochet items for your loved ones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${cookie.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <Header />
              <main className="grow pt-20">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
