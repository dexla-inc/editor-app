import { Inter } from "next/font/google";
import { GlobalProviders } from "@/app/globalProviders";
import { ReactNode } from "react";

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

export const metadata = {
  title: "Editor",
  description: "Dexla Editor",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

// <Head>
//   <title>Editor</title>
//   <meta name="description" content="Dexla Editor" />
//   <meta
//       name="viewport"
//       content="width=device-width, initial-scale=1, maximum-scale=1"
//   />
//
//   <link
//       rel="icon"
//       type="image/x-icon"
//       href={isLive ? "" : "/favicon.ico"}
//   />
// </Head>

export default function RootLayout({ children }: { children: ReactNode }) {
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
