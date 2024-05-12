import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BUY&SELL",
  description: "Buy and sell your products easily without any middleman, you can directly contact the seller through the mail",
  icons: {
    icon: "/assets/favicon.png"

  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" bg-gray-951 ">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
