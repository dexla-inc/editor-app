import LogicFlowInitialModal from "@/components/logic-flow/LogicFlowInitialModal";
import { ContextMenuProvider } from "@/contexts/ContextMenuProvider";
import AuthProvider from "@/components/AuthProvider";
import { useUserConfigStore } from "@/stores/userConfig";
import { darkTheme, theme } from "@/utils/branding";
import { cache } from "@/utils/emotionCache";
import { MantineProvider } from "@mantine/core";
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
import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DataProvider } from "@/contexts/DataProvider";
import { MantineGlobal } from "@/components/MantineGlobal";
import { EditorAppHead } from "@/components/EditorAppHead";

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

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
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

  const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);

  // Move into its own component
  //const GTM_ID = "GTM-P3DVFXMS";

  // const [loadTagManager, setLoadTagManager] = useState(false);

  // useEffect(() => {
  //   setLoadTagManager(!isLive && process.env.NODE_ENV !== "development");

  //   if (loadTagManager) {
  //     const tagManagerArgs = {
  //       gtmId: GTM_ID,
  //     };

  //     TagManager.initialize(tagManagerArgs);
  //   }
  // }, [loadTagManager, isLive]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={isDarkTheme ? darkTheme : theme}
      emotionCache={cache}
    >
      <ContextMenuProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Hydrate state={pageProps.dehydratedState}>
            <AuthProvider>
              <EditorAppHead />
              <Head>
                <title>Editor</title>
                <meta name="description" content="Dexla Editor" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1, maximum-scale=1"
                />

                <link
                  rel="icon"
                  type="image/x-icon"
                  // TODO: Fix this without using isLive
                  //href={isLive ? "" : "/favicon.ico"}
                />
              </Head>

              {/* Google Tag Manager */}
              {/* {loadTagManager && (
            <Script id="google-analytics" strategy="afterInteractive">
              {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
        `}
            </Script>
          )} */}
              {/* End Google Tag Manager */}
              {/* {loadTagManager && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id='${GTM_ID}'`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              ></iframe>
            </noscript>
          )} */}
              <main className={inter.variable}>
                <Notifications />
                <MantineGlobal />
                <ReactFlowProvider>
                  <DataProvider>
                    <ModalsProvider
                      modals={{ logicFlows: LogicFlowInitialModal }}
                    >
                      <Component {...pageProps} />
                    </ModalsProvider>
                  </DataProvider>
                </ReactFlowProvider>
                <SpeedInsights />
              </main>
            </AuthProvider>
          </Hydrate>
        </QueryClientProvider>
      </ContextMenuProvider>
    </MantineProvider>
  );
}
