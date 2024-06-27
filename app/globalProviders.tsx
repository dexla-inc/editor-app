"use client";

import {
  dehydrate,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";
import { queryClient } from "@/utils/reactQuery";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactNode, useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import Script from "next/script";
import { ProgressBar } from "@/components/ProgressBar";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "block",
  subsets: ["latin"],
  preload: true,
});

const GTM_ID = "GTM-P3DVFXMS";
const nodeEnv = process.env.NODE_ENV;

export const GlobalProviders = ({ children }: { children: ReactNode }) => {
  const dehydratedState = dehydrate(queryClient);
  const isLive = useEditorTreeStore((state) => state.isLive);

  const [loadTagManager, setLoadTagManager] = useState(false);

  useEffect(() => {
    setLoadTagManager(!isLive && nodeEnv !== "development");

    if (loadTagManager) {
      const tagManagerArgs = {
        gtmId: GTM_ID,
      };

      TagManager.initialize(tagManagerArgs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${poppins.style.fontFamily};
        }
      `}</style>
      {/*Google Tag Manager*/}
      {loadTagManager && (
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
        </Script>
      )}
      {/*End Google Tag Manager*/}
      {loadTagManager && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id='${GTM_ID}'`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
      )}
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <ProgressBar>{children}</ProgressBar>
        </HydrationBoundary>
      </QueryClientProvider>
      <SpeedInsights />
    </>
  );
};
