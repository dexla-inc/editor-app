import { getByDomain } from "@/requests/projects/queries";
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
import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { isMatchingUrl } from "./[page]";
import { useRouter } from "next/router";
import { useCheckIfIsLive } from "@/hooks/useCheckIfIsLive";

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

const AuthProvider = ({ children }: PropsWithChildren) => {
  const { isClient, isLive } = useCheckIfIsLive();

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
  const { isLive } = useCheckIfIsLive();
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
      <AuthProvider>
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
                    maxHeight: "100vh",
                    minHeight: "100vh",
                    background: "white",
                    // For WebKit browsers (e.g., Chrome, Safari)
                    "::-webkit-scrollbar": {
                      width: isLive && "0px",
                      height: isLive && "0px",
                    },

                    // For Firefox
                    scrollbarWidth: isLive && "none",

                    // For IE and Edge
                    "-ms-overflow-style": isLive && "none",
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
      </AuthProvider>
    </MantineProvider>
  );
}
