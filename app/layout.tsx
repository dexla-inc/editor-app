import { Inter, Poppins } from "next/font/google";
import { GlobalProviders } from "@/app/globalProviders";
import { ReactNode } from "react";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// const poppins = Poppins({
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   style: ["normal", "italic"],
//   subsets: ["latin"],
//   variable: "--font-poppins",
//   preload: true,
// });

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
        <style></style>
        <main className={inter.variable}>
          <GlobalProviders>{children}</GlobalProviders>
        </main>
      </body>
    </html>
  );
}
