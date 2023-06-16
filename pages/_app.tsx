import { cache } from "@/utils/emotionCache";
import {
  DEFAULT_THEME,
  Global,
  LoadingOverlay,
  MantineProvider,
  MantineTheme,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
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
import { useEffect, useState } from "react";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
};

const setVh = (vh: number) => {
  document.documentElement.style.setProperty("--vh", vh + "px");
};

export default function App(props: AppProps) {
  const { height } = useViewportSize();

  const { Component, pageProps } = props;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    setVh(height);
  }, [height]);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={theme}
      emotionCache={cache}
    >
      <RequiredAuthProvider
        authUrl={process.env.NEXT_PUBLIC_AUTH_URL as string}
        displayWhileLoading={<LoadingOverlay visible overlayBlur={2} />}
        displayIfLoggedOut={
          <RedirectToLogin
            postLoginRedirectUrl={process.env.NEXT_PUBLIC_AUTH_URL as string}
          />
        }
      >
        <Head>
          <title>Editor</title>
          <meta name="description" content="Dexla Editor" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
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
                    maxHeight: "var(--vh, 100vh)",
                    minHeight: "var(--vh, auto)",
                    background: "white",
                  },

                  html: {
                    maxHeight: "-webkit-fill-available",
                  },
                }}
              />
              <Component {...pageProps} />
            </Hydrate>
          </QueryClientProvider>
        </main>
      </RequiredAuthProvider>
    </MantineProvider>
  );
}
