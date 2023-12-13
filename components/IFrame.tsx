import { useUserTheme } from "@/hooks/useUserTheme";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { NAVBAR_MIN_WIDTH, NAVBAR_WIDTH } from "@/utils/config";
import createCache from "@emotion/cache";
import { Box, BoxProps, MantineProvider, ScrollArea } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  projectId: string;
} & BoxProps;

export const IFrame = ({ children, projectId, ...props }: Props) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement>();
  const setIframeWindow = useEditorStore((state) => state.setIframeWindow);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);

  const theme = useEditorStore((state) => state.theme);
  useUserTheme(projectId);

  const w = contentRef?.contentWindow;
  const mountNode = w?.document.body;
  const insertionTarget = w?.document.head;

  mountNode?.setAttribute(
    "style",
    `overflow: visible; margin: 10px 0px 10px 10px;`,
  );

  const styleTag = document.createElement("style");
  styleTag.textContent = `* { box-sizing: border-box; }`;
  insertionTarget?.appendChild(styleTag);

  useEffect(() => {
    const w = contentRef?.contentWindow;
    if (w) {
      setIframeWindow(w);
    }
  }, [contentRef, setIframeWindow]);

  const getContainerStyles = (isPreviewMode: boolean, isTabPinned: boolean) => {
    const containerStyles = {
      overflow: "visible",
      border: "none",
      width: "100%",
      height: "100%",
      marginLeft: 0 as string | number,
    };

    if (!isPreviewMode) {
      containerStyles.width = isTabPinned
        ? `calc(100% - ${NAVBAR_WIDTH}px)`
        : `calc(100% - ${NAVBAR_MIN_WIDTH - 50}px)`; // Weird sizing issue that I haven't got time to investigate, had to hack it

      containerStyles.marginLeft = isTabPinned
        ? `${NAVBAR_WIDTH}px`
        : `${NAVBAR_MIN_WIDTH - 50}px`; // Weird sizing issue that I haven't got time to investigate, had to hack it
    }

    return containerStyles;
  };

  const styles = getContainerStyles(isPreviewMode, isTabPinned);

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
      onMouseDown={handleMouseDown}
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
              component={ScrollArea}
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
