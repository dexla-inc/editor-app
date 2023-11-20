import { ContextMenuProvider } from "@/contexts/ContextMenuProvider";
import { useCheckIfIsLive } from "@/hooks/useCheckIfIsLive";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { cache } from "@/utils/emotionCache";
import {
  DEFAULT_THEME,
  Global,
  LoadingOverlay,
  MantineProvider,
  MantineTheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RedirectToLogin, RequiredAuthProvider } from "@propelauth/react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";
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

export const theme: MantineTheme = {
  ...DEFAULT_THEME,
  fontFamily: "var(--font-inter)",
  headings: {
    ...DEFAULT_THEME.headings,
    fontFamily: "var(--font-inter)",
  },
  // @ts-ignore
  breakpoints: { xs: 500, sm: 1100, md: 1150, lg: 1200, xl: 1400 },
  black: "#222",
  primaryColor: "teal",
  components: {
    Input: {
      styles: (theme) => ({
        input: { borderColor: theme.colors.gray[3] },
      }),
    },
    Select: {
      styles: (theme) => ({
        input: { borderColor: theme.colors.gray[3] },
      }),
    },
    Card: {
      defaultProps: (theme) => ({
        style: { borderColor: theme.colors.gray[3] },
      }),
    },
  },
};

const AuthProvider = ({
  children,
  isLive,
}: PropsWithChildren & { isLive: boolean }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [isClient]);

  if (!isClient) return null;

  if (isLive) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <RequiredAuthProvider
      authUrl={process.env.NEXT_PUBLIC_AUTH_URL as string}
      displayWhileLoading={<LoadingOverlay visible overlayBlur={2} />}
      displayIfLoggedOut={
        <RedirectToLogin
          postLoginRedirectUrl={
            process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL as string
          }
        />
      }
    >
      {children}
    </RequiredAuthProvider>
  );
};

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const isLive = useCheckIfIsLive();
  const [loadTagManager, setLoadTagManager] = useState(false);

  const initializeAuth = usePropelAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      theme={theme}
      emotionCache={cache}
    >
      <ContextMenuProvider>
        <AuthProvider isLive={isLive}>
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
          <body>
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
                <Hydrate state={pageProps.dehydratedState}>
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
                        background: "white",
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
                </Hydrate>
              </QueryClientProvider>
            </main>
          </body>
        </AuthProvider>
      </ContextMenuProvider>
    </MantineProvider>
  );
}
