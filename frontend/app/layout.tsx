"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import NavBar from "@/components/company-context/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const pathname = usePathname(); 

  const hideNavBarRoutes = ["/login", "/signup", '/'];

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}>
        <MantineProvider>
          <div className="min-h-screen flex flex-col">

            {!hideNavBarRoutes.includes(pathname) && <NavBar />}
            
            <main>{children}</main>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
