import { usePreviousDeep } from "@/hooks/usePreviousDeep";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import createCache from "@emotion/cache";
import {
  Box,
  BoxProps,
  DEFAULT_THEME,
  MantineProvider,
  MantineTheme,
} from "@mantine/core";
import { usePrevious } from "@mantine/hooks";
import isEqual from "lodash.isequal";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const theme: MantineTheme = {
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
} & BoxProps;

export const IFrame = ({ children, ...props }: Props) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement>();
  const setIframeWindow = useEditorStore((state) => state.setIframeWindow);
  const editorTree = useEditorStore((state) => state.tree);
  const isLoading = useAppStore((state) => state.isLoading);
  const [height, setHeight] = useState<number>();
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const w = contentRef?.contentWindow;
  const mountNode = w?.document.body;
  const insertionTarget = w?.document.head;
  mountNode?.setAttribute(
    "style",
    "margin: 0; overflow: visible; margin: 40px;"
  );

  const currentElementHeight =
    w?.document.getElementById(selectedComponentId!)?.scrollHeight ?? 0;
  const prevElementHeight = usePrevious(currentElementHeight);
  const previousEditorTree = usePreviousDeep(editorTree);
  const isDifferentEditorTree = !isEqual(editorTree, previousEditorTree);
  const currentCanvasHeight = w?.document?.body?.scrollHeight || 0;
  const prevCanvasHeight = usePrevious(currentCanvasHeight);

  useEffect(() => {
    const w = contentRef?.contentWindow;
    if (w) {
      setIframeWindow(w);
    }
  }, [contentRef, setIframeWindow]);

  const syncIframeHeight = useCallback(() => {
    if (!w || !mountNode) {
      return;
    }

    if (prevCanvasHeight && currentElementHeight > prevCanvasHeight) {
      setHeight(prevCanvasHeight);
    } else if (
      currentCanvasHeight &&
      prevCanvasHeight !== currentCanvasHeight
    ) {
      setHeight(
        Math.min(
          currentCanvasHeight,
          currentCanvasHeight + currentElementHeight - (prevElementHeight || 0)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    w,
    isDifferentEditorTree,
    selectedComponentId,
    currentElementHeight,
    prevElementHeight,
    currentCanvasHeight,
    prevCanvasHeight,
    mountNode,
    isLoading,
  ]);

  useEffect(() => {
    // TODO: Fix this as we are currently having to delay calculation to wait for the content to be rendered first
    setTimeout(syncIframeHeight, 100);
  }, [syncIframeHeight]);

  return (
    <Box
      ref={setContentRef as any}
      component="iframe"
      style={{
        overflow: "visible",
        border: "none",
        width: "100%",
        height: (height ?? 0) + 40,
      }}
      {...props}
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
            {children}
          </MantineProvider>,
          mountNode
        )}
    </Box>
  );
};
