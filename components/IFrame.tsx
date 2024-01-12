import { useProjectQuery } from "@/hooks/reactQuery/useProjectQuery";
import { useUserTheme } from "@/hooks/useUserTheme";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { decodeSchema } from "@/utils/compression";
import { HEADER_HEIGHT, NAVBAR_MIN_WIDTH, NAVBAR_WIDTH } from "@/utils/config";
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
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  projectId: string;
} & BoxProps;

export const IFrame = ({ children, projectId, ...props }: Props) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement>();
  const [customCode, setCustomCode] = useState<any | null>(null);
  const setIframeWindow = useEditorStore((state) => state.setIframeWindow);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const isLoading = useAppStore((state) => state.isLoading);
  const { data: project } = useProjectQuery(projectId);

  const theme = useUserTheme(projectId);
  const w = contentRef?.contentWindow;
  const mountNode = w?.document.body;
  const insertionTarget = w?.document.head;

  useEffect(() => {
    mountNode?.setAttribute(
      "style",
      `overflow: visible; margin: 10px 0px 10px 10px;`,
    );

    const styleTag = document.createElement("style");
    styleTag.textContent = `* { box-sizing: border-box; }`;
    insertionTarget?.appendChild(styleTag);

    // add head custom code
    if (customCode?.headCode) {
      // check if head code already exists
      const existingHeadCode = w?.document.getElementById("footer-code");
      if (!existingHeadCode) {
        const scriptTag = w?.document.createElement("script");

        if (scriptTag) {
          scriptTag!.textContent = customCode.headCode;
          scriptTag!.setAttribute("id", "head-code");
          insertionTarget?.appendChild(scriptTag!);
        }
      }
    }

    // add footer custom code
    if (customCode?.footerCode) {
      // check if footer code already exists
      const existingFooterCode = w?.document.getElementById("footer-code");
      if (!existingFooterCode) {
        const scriptTag = w?.document.createElement("script");
        if (scriptTag) {
          scriptTag.textContent = customCode.footerCode;
          scriptTag.setAttribute("id", "footer-code");
          mountNode?.appendChild(scriptTag!);
        }
      }
    }
  }, [
    customCode?.footerCode,
    customCode?.headCode,
    insertionTarget,
    mountNode,
    w?.document,
  ]);

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

  useEffect(() => {
    if (project) {
      const customCode = project.customCode
        ? JSON.parse(decodeSchema(project.customCode))
        : undefined;
      if (customCode) {
        setCustomCode(customCode);
      }
    }
  }, [project]);

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
