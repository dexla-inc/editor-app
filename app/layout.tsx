import { Inter } from "next/font/google";
import { GlobalProviders } from "@/app/globalProviders";
import { ReactNode } from "react";
import "./global.css";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className={inter.variable}>
          <GlobalProviders>{children}</GlobalProviders>
        </main>
      </body>
    </html>
  );
}
