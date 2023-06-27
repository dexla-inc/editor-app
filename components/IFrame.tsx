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

    let currentCanvasHeight = w?.document?.body?.scrollHeight || 0;
    // If the element is >= the value that we'd get by
    // having an element with 100vh, we will get into an infinite state update
    // if we tried to update the canvas height to the element's height.
    // Therefore we calculate the value of 100vh and check for it. If the element's height
    // is 100vh, we don't update.
    const suspectedVhValue = Math.max(
      w?.document?.documentElement?.clientHeight || 0,
      w?.innerHeight || 0
    );

    // TODO: If we have an element which is e.g. 110vh (anything
    // greater than 100vh) then we add an artificial minimum since otherwise we'll
    // get into an infinite state update. I'm not sure if there's a way to correctly
    // handle this? Maybe we could look at the component tree and figure out which
    // element has the vh?
    if (
      currentElementHeight > suspectedVhValue &&
      // Don't add a minimum if we're initially figuring out the element's height
      prevElementHeight !== 0
    ) {
      currentCanvasHeight = Math.min(currentCanvasHeight, 10_000);
    }

    setHeight(currentCanvasHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    w,
    selectedComponentId,
    currentElementHeight,
    mountNode,
    prevElementHeight,
    isLoading,
  ]);

  useEffect(() => {
    // TODO: Fix this as we are currently having to delay calculation to wait for the content to be rendered first
    setTimeout(syncIframeHeight, 800);
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
