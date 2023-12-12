import { getTheme } from "@/requests/themes/queries";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { defaultTheme } from "@/utils/branding";
import { NAVBAR_MIN_WIDTH, NAVBAR_WIDTH } from "@/utils/config";
import createCache from "@emotion/cache";
import { Box, BoxProps, MantineProvider, ScrollArea } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  isLive?: boolean;
  projectId: string;
} & BoxProps;

export const IFrame = ({ children, projectId, isLive, ...props }: Props) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement>();
  const setIframeWindow = useEditorStore((state) => state.setIframeWindow);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);

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
            const hex = color.hex.substring(0, 7);
            return {
              ...userColors,
              [color.name]: [
                theme.fn.lighten(hex, 0.9),
                theme.fn.lighten(hex, 0.8),
                theme.fn.lighten(hex, 0.7),
                theme.fn.lighten(hex, 0.6),
                theme.fn.lighten(hex, 0.5),
                theme.fn.lighten(hex, 0.4),
                color.hex,
                theme.fn.darken(hex, 0.1),
                theme.fn.darken(hex, 0.2),
                theme.fn.darken(hex, 0.3),
              ],
            };
          }, {}),
        },
        primaryColor: "Primary",
        logoUrl: userTheme.data?.logoUrl,
        faviconUrl: userTheme.data?.faviconUrl,
        logos: userTheme.data?.logos,
        hasCompactButtons: userTheme.data?.hasCompactButtons,
        cardStyle: userTheme.data?.cardStyle,
        defaultFont: userTheme.data?.defaultFont,
        defaultSpacing:
          userTheme.data?.defaultSpacing ?? defaultTheme.spacing.md,
        defaultRadius: userTheme.data?.defaultRadius ?? defaultTheme.radius.md,
        theme: userTheme.data?.theme ?? defaultTheme.theme,
        // loader: userTheme.data?.loader?
        // focusRing: userTheme.data?.focusRing,
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
    isTabPinned: boolean,
  ) => {
    const containerStyles = {
      overflow: isLive ? "hidden" : "visible",
      border: "none",
      width: "100%",
      height: isLive ? "100vh" : "100%",
      marginLeft: 0 as string | number,
    };

    if (!isLive && !isPreviewMode) {
      containerStyles.width = isTabPinned
        ? `calc(100% - ${NAVBAR_WIDTH}px)`
        : `calc(100% - ${NAVBAR_MIN_WIDTH - 50}px)`; // Weird sizing issue that I haven't got time to investigate, had to hack it

      containerStyles.marginLeft = isTabPinned
        ? `${NAVBAR_WIDTH}px`
        : `${NAVBAR_MIN_WIDTH - 50}px`; // Weird sizing issue that I haven't got time to investigate, had to hack it
    }

    return containerStyles;
  };

  const styles = getContainerStyles(isLive, isPreviewMode, isTabPinned);

  const handleMouseDown = useCallback(() => {
    if (isTabPinned) {
      setActiveTab("layers");
    } else {
      setActiveTab(undefined);
    }
  }, [isTabPinned, setActiveTab]);

  return (
    <Box
      id="iframe-canvas"
      onMouseDown={!isLive ? handleMouseDown : undefined}
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
            <Box
              // @ts-ignore
              component={!isLive ? ScrollArea : "div"}
              offsetScrollbars
              id="iframe-content"
            >
              {children}
            </Box>
          </MantineProvider>,
          mountNode,
        )}
    </Box>
  );
};
