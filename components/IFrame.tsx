import { getTheme } from "@/requests/themes/queries";
import { useEditorStore } from "@/stores/editor";
import { HEADER_HEIGHT } from "@/utils/config";
import createCache from "@emotion/cache";
import {
  Box,
  BoxProps,
  DEFAULT_THEME,
  MantineProvider,
  MantineTheme,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const defaultTheme: MantineTheme = {
  ...DEFAULT_THEME,
  fontFamily: "Arial, sans-serif",
  headings: {
    ...DEFAULT_THEME.headings,
    fontFamily: "Arial, sans-serif",
  },
  primaryColor: "teal",
};

type Props = {
  onClick?: () => void;
  isLive?: boolean;
} & BoxProps;

export const IFrame = ({ children, isLive, ...props }: Props) => {
  const router = useRouter();
  const [contentRef, setContentRef] = useState<HTMLIFrameElement>();
  const setIframeWindow = useEditorStore((state) => state.setIframeWindow);

  const theme = useEditorStore((state) => state.theme);
  const setTheme = useEditorStore((state) => state.setTheme);

  const userTheme = useQuery({
    queryKey: ["theme"],
    queryFn: () => getTheme(router.query.id as string),
    enabled: !!router.query.id,
  });

  useEffect(() => {
    console.log({ userTheme });
    if (userTheme.isFetched) {
      setTheme({
        ...theme,
        colors: {
          ...theme.colors,
          ...userTheme.data?.colors.reduce((userColors, color) => {
            return {
              ...userColors,
              [color.name]: [
                theme.fn.lighten(color.hex, 0.9),
                theme.fn.lighten(color.hex, 0.8),
                theme.fn.lighten(color.hex, 0.7),
                theme.fn.lighten(color.hex, 0.6),
                theme.fn.lighten(color.hex, 0.5),
                theme.fn.lighten(color.hex, 0.4),
                color.hex,
                theme.fn.darken(color.hex, 0.1),
                theme.fn.darken(color.hex, 0.2),
                theme.fn.darken(color.hex, 0.3),
              ],
            };
          }, {}),
        },
        primaryColor: "Primary",
        logoUrl: userTheme.data?.logoUrl,
        faviconUrl: userTheme.data?.faviconUrl,
        logos: userTheme.data?.logos,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTheme.isFetched, userTheme.data?.colors, setTheme]);

  const w = contentRef?.contentWindow;
  const mountNode = w?.document.body;
  const insertionTarget = w?.document.head;
  if (!isLive) {
    mountNode?.setAttribute("style", "overflow: visible; margin: 40px 10px");
  } else {
    mountNode?.setAttribute("style", "margin: 0px");
  }

  const styleTag = document.createElement("style");
  styleTag.textContent = `* { box-sizing: border-box; }`;
  insertionTarget?.appendChild(styleTag);

  useEffect(() => {
    const w = contentRef?.contentWindow;
    if (w) {
      setIframeWindow(w);
    }
  }, [contentRef, setIframeWindow]);

  return (
    <Box
      ref={setContentRef as any}
      component="iframe"
      style={{
        overflow: "visible",
        border: "none",
        width: isLive ? "100vw" : "100%",
        height: isLive ? "100vh" : `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
      {...props}
      allow="clipboard-read; clipboard-write"
    >
      {mountNode &&
        insertionTarget &&
        createPortal(
          <MantineProvider
            withNormalizeCSS
            theme={theme}
            emotionCache={createCache({
              container: insertionTarget,
              key: "iframe-canvas",
            })}
          >
            <Box id="iframe-content">{children}</Box>
          </MantineProvider>,
          mountNode,
        )}
    </Box>
  );
};
