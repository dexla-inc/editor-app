import { getTheme } from "@/requests/themes/queries";
import { useEditorStore } from "@/stores/editor";
import { NAVBAR_MIN_WIDTH, NAVBAR_WIDTH } from "@/utils/config";
import createCache from "@emotion/cache";
import {
  Box,
  BoxProps,
  DEFAULT_THEME,
  MantineProvider,
  MantineTheme,
  ScrollArea,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
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
  projectId: string;
} & BoxProps;

export const IFrame = ({ children, projectId, isLive, ...props }: Props) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement>();
  const setIframeWindow = useEditorStore((state) => state.setIframeWindow);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const pinTab = useEditorStore((state) => state.pinTab);

  const theme = useEditorStore((state) => state.theme);
  const setTheme = useEditorStore((state) => state.setTheme);

  const userTheme = useQuery({
    queryKey: ["theme"],
    queryFn: () => getTheme(projectId),
    enabled: !!projectId,
  });

  useEffect(() => {
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

  let cssString = "";

  // Add styles depending on the `isLive` prop
  !isLive
    ? (cssString = `
        overflow: visible; margin: 10px 0px 10px 10px;    
    `)
    : (cssString = `margin: 0px;`);

  mountNode?.setAttribute("style", cssString);

  const styleTag = document.createElement("style");
  styleTag.textContent = `* { box-sizing: border-box; }`;
  insertionTarget?.appendChild(styleTag);

  useEffect(() => {
    const w = contentRef?.contentWindow;
    if (w) {
      setIframeWindow(w);
    }
  }, [contentRef, setIframeWindow]);

  const getContainerStyles = (
    isLive: boolean | undefined,
    isPreviewMode: boolean,
    pinTab: boolean,
  ) => {
    const containerStyles = {
      overflow: isLive ? "hidden" : "visible",
      border: "none",
      width: "100%",
      height: isLive ? "100vh" : "100%",
      marginLeft: 0 as string | number,
    };

    if (!isLive && !isPreviewMode) {
      containerStyles.width = pinTab
        ? `calc(100% - ${NAVBAR_WIDTH}px)`
        : `calc(100% - ${NAVBAR_MIN_WIDTH}px)`;

      containerStyles.marginLeft = pinTab
        ? `${NAVBAR_WIDTH}px`
        : `${NAVBAR_MIN_WIDTH}px`;
    }

    return containerStyles;
  };

  const styles = getContainerStyles(isLive, isPreviewMode, pinTab);

  return (
    <Box
      onMouseDown={() => {
        setActiveTab(undefined);
      }}
      ref={setContentRef as any}
      component="iframe"
      style={styles}
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
            <Box component={ScrollArea} offsetScrollbars id="iframe-content">
              {children}
            </Box>
          </MantineProvider>,
          mountNode,
        )}
    </Box>
  );
};
