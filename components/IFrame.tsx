import { useUserTheme } from "@/hooks/editor/useUserTheme";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { HEADER_HEIGHT, NAVBAR_MIN_WIDTH, NAVBAR_WIDTH } from "@/utils/config";
import { initializeFonts } from "@/utils/webfontloader";
import createCache from "@emotion/cache";
import {
  Box,
  BoxProps,
  Loader,
  MantineProvider,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useEditorTreeStore } from "@/stores/editorTree";
import { isEditorModeSelector } from "@/utils/componentSelectors";

type Props = {
  projectId: string;
} & BoxProps;

export const IFrame = ({ children, projectId, ...props }: Props) => {
  const isEditorMode = useEditorTreeStore(isEditorModeSelector);
  const [contentRef, setContentRef] = useState<HTMLIFrameElement>();
  const setIframeWindow = useEditorStore((state) => state.setIframeWindow);
  const navbarWidth = useUserConfigStore((state) => state.navbarWidth);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useUserTheme(projectId);
  const w = contentRef?.contentWindow;
  const mountNode = w?.document.body;
  const insertionTarget = w?.document.head;

  useEffect(() => {
    if (theme?.fontFamily && theme?.headings?.fontFamily) {
      initializeFonts(theme.fontFamily, theme.headings.fontFamily);
    }
  }, [theme]);

  useEffect(() => {
    mountNode?.setAttribute(
      "style",
      `overflow: visible; margin: 24px 0px 24px 10px;`,
    );

    const styleTag = document.createElement("style");
    styleTag.textContent = `* { box-sizing: border-box; }`;
    insertionTarget?.appendChild(styleTag);
  }, [insertionTarget, mountNode, w?.document]);

  useEffect(() => {
    setIsLoading(false);
    const w = contentRef?.contentWindow;

    if (w) {
      setIframeWindow(w);
    }
  }, [contentRef, setIframeWindow]);

  const getContainerStyles = (isTabPinned: boolean) => {
    const containerStyles = {
      overflow: "visible",
      border: "none",
      width: "100%",
      height: "100%",
      marginLeft: 0 as string | number,
    };

    containerStyles.width = isTabPinned
      ? `calc(100% - ${navbarWidth}px)`
      : `calc(100% - ${navbarWidth - 50}px)`; // Weird sizing issue that I haven't got time to investigate, had to hack it

    containerStyles.marginLeft = isTabPinned
      ? `${navbarWidth}px`
      : `${navbarWidth - 50}px`; // Weird sizing issue that I haven't got time to investigate, had to hack it

    return containerStyles;
  };

  const styles = getContainerStyles(isTabPinned);

  if (!theme) {
    return null;
  }

  return isLoading ? (
    <Box
      pos="relative"
      style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}
      ml={isTabPinned ? NAVBAR_WIDTH : NAVBAR_MIN_WIDTH - 50} // Weird sizing issue that I haven't got time to investigate, had to hack it
      p="sm"
    >
      <Paper
        pos="relative"
        shadow="xs"
        sx={{
          width: "100%",
          minHeight: "400px",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Stack align="center">
          <Text color="teal.6" size="sm" weight="bold">
            Loading the page
          </Text>
          <Loader />
        </Stack>
      </Paper>
    </Box>
  ) : (
    <Box
      id="iframe-canvas"
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
              className={isEditorMode ? "editor-mode" : "preview-mode"}
              component={ScrollArea}
              offsetScrollbars
              id="iframe-content"
              styles={{
                root: { overflow: "visible" },
                viewport: { overflow: "visible!important" },
              }}
            >
              {children}
            </Box>
          </MantineProvider>,
          mountNode,
        )}
    </Box>
  );
};
