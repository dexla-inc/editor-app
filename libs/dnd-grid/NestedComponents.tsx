import { Box, MantineProvider } from "@mantine/core";
import ComponentList from "@/libs/dnd-grid/components/ComponentList";
import ComponentToolbox from "@/libs/dnd-grid/components/ComponentToolbox";
import ErrorBoundary from "@/libs/dnd-grid/components/ErrorBoundary";
import DnDGrid from "@/libs/dnd-grid/DnDGrid";
import { useState } from "react";
import { createPortal } from "react-dom";

export const NestedComponents = ({ components }: any) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document.body;

  return (
    <MantineProvider>
      <div style={{ padding: "10px" }}>
        <ComponentToolbox />
        <ComponentList />
        <Box
          id="iframe-canvas"
          ref={setContentRef as any}
          component="iframe"
          style={{ width: "100%", height: "500px", border: "none" }}
          allow="clipboard-read; clipboard-write"
        >
          {mountNode &&
            createPortal(
              <Box id="iframe-content">
                <ErrorBoundary>
                  <DnDGrid
                    components={components}
                    iframeWindow={contentRef.contentWindow}
                  />
                </ErrorBoundary>
              </Box>,
              mountNode,
            )}
        </Box>
      </div>
    </MantineProvider>
  );
};
