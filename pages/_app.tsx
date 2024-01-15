import LogicFlowInitialModal from "@/components/logic-flow/LogicFlowInitialModal";
import { ContextMenuProvider } from "@/contexts/ContextMenuProvider";
import { useCheckIfIsLive } from "@/hooks/useCheckIfIsLive";
import AuthProvider from "@/pages/AuthProvider";
import InitializeVariables from "@/pages/InitializeVariables";
import InstantiatePropelAuthStore from "@/pages/InstantiatePropelAuthStore";
import { useUserConfigStore } from "@/stores/userConfig";
import {
  DARK_MODE,
  GREEN_COLOR,
  LIGHT_MODE,
  darkTheme,
  theme,
} from "@/utils/branding";
import { cache } from "@/utils/emotionCache";
import { Global, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import { ReactFlowProvider } from "reactflow";

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

const GTM_ID = "GTM-P3DVFXMS";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);
  const isLive = useCheckIfIsLive();

  const [loadTagManager, setLoadTagManager] = useState(false);

  useEffect(() => {
    setLoadTagManager(!isLive && process.env.NODE_ENV !== "development");

    if (loadTagManager) {
      const tagManagerArgs = {
        gtmId: GTM_ID,
      };

      TagManager.initialize(tagManagerArgs);
    }
  }, [loadTagManager, isLive]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={isDarkTheme ? darkTheme : theme}
      emotionCache={cache}
    >
      <ContextMenuProvider>
        <AuthProvider isLive={isLive}>
          {!isLive && <InstantiatePropelAuthStore />}
          <Head>
            <title>Editor</title>
            <meta name="description" content="Dexla Editor" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            />
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          </Head>
          {/* Google Tag Manager */}
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
          {/* End Google Tag Manager */}
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
          <main className={inter.variable}>
            <QueryClientProvider client={queryClient}>
              <InitializeVariables isLive={isLive} pageProps={pageProps} />
              <Hydrate state={pageProps.dehydratedState}>
                <ModalsProvider modals={{ logicFlows: LogicFlowInitialModal }}>
                  <Notifications />
                  <Global
                    styles={{
                      "*, *::before, *::after": {
                        boxSizing: "border-box",
                      },
                      body: {
                        margin: 0,
                        padding: 0,
                        ...theme.fn.fontStyles(),
                        lineHeight: theme.lineHeight,
                        maxHeight: "100vh",
                        minHeight: "100vh",
                        background:
                          !isLive && isDarkTheme ? DARK_MODE : LIGHT_MODE,
                        color:
                          !isLive && isDarkTheme ? GREEN_COLOR : theme.black,
                        // For WebKit browsers (e.g., Chrome, Safari)
                        "::-webkit-scrollbar": {
                          width: isLive ? "0px" : "8px",
                          height: isLive && "0px",
                        },
                        "::-webkit-scrollbar-thumb": {
                          backgroundColor: !isLive && "#888",
                          borderRadius: !isLive && "10px",
                        },

                        // For Firefox
                        scrollbarWidth: isLive ? "none" : "thin",
                        scrollbarColor: !isLive && "#888 transparent",

                        // For IE and Edge
                        msOverflowStyle: isLive
                          ? "none"
                          : "-ms-autohiding-scrollbar",
                      },

                      html: {
                        maxHeight: "-webkit-fill-available",
                      },
                    }}
                  />
                  <ReactFlowProvider>
                    <Component {...pageProps} />
                  </ReactFlowProvider>
                </ModalsProvider>
              </Hydrate>
            </QueryClientProvider>
            <SpeedInsights />
          </main>
        </AuthProvider>
      </ContextMenuProvider>
    </MantineProvider>
  );
}
