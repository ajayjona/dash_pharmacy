import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "@/components/Providers";
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: "Dash Care | Your health, delivered.",
  description: "Order prescription drugs, vitamins, and healthcare products online. Same-day delivery in Kampala.",
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
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`font-sans antialiased text-text-primary bg-background`}
      >
        <NextTopLoader 
          color="#016A40"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #016A40,0 0 5px #016A40"
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
