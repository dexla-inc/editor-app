import { Inter } from "next/font/google";
import { GlobalProviders } from "@/app/globalProviders";
import { ReactNode } from "react";
import { headers } from "next/headers";
import { getDeploymentPage } from "@/requests/deployments/queries-noauth";
import { PageProps } from "@/types/app";

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
  params: { page },
  children,
}: PageProps & { children: ReactNode }) {
  const url = headers().get("host") as string;

  let currentSlug = (page?.at(0) as string) ?? "/";
  if (currentSlug === "index") {
    currentSlug = "/";
  }

  const deploymentPage = await getDeploymentPage(url, currentSlug);

  return (
    <html lang="en">
      <body>
        <main className={inter.variable}>
          <GlobalProviders branding={deploymentPage.branding}>
            {children}
          </GlobalProviders>
        </main>
      </body>
    </html>
  );
}
