import { Box, MantineProvider } from "@mantine/core";
import ComponentList from "@/libs/dnd-grid/components/ComponentList";
import ComponentToolbox from "@/libs/dnd-grid/components/ComponentToolbox";
import ErrorBoundary from "@/libs/dnd-grid/components/ErrorBoundary";
import DnDGrid from "@/libs/dnd-grid/DnDGrid";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useEditorStore } from "@/stores/editor";
import { theme } from "@/utils/branding";
import createCache from "@emotion/cache";

export const NestedComponents = () => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document.body;

  const setIframeWindow = useEditorStore((state) => state.setIframeWindow);

  useEffect(() => {
    setIframeWindow(contentRef?.contentWindow as Window);
  }, [contentRef?.contentWindow]);

  return (
    <div style={{ padding: "10px" }}>
      <Box
        id="iframe-canvas"
        ref={setContentRef as any}
        component="iframe"
        style={{ width: "100%", height: "500px", border: "none" }}
        allow="clipboard-read; clipboard-write"
      >
        {mountNode &&
          createPortal(
            <MantineProvider
              withNormalizeCSS
              theme={theme}
              emotionCache={createCache({
                container: contentRef?.contentWindow.document.head,
                key: "iframe-canvas",
              })}
            >
              <Box id="iframe-content">
                <ComponentToolbox />
                <ComponentList />
                <ErrorBoundary>
                  <DnDGrid />
                </ErrorBoundary>
              </Box>
            </MantineProvider>,
            mountNode,
          )}
      </Box>
    </div>
  );
};
