import { ASIDE_WIDTH, HEADER_HEIGHT } from "@/utils/config";
import { Box, ScrollArea } from "@mantine/core";
import EditorAsideSections from "@/components/aside/EditorAsideSections";
import { Aside as MantineAside } from "@mantine/core";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memo } from "react";

export const AsideComponent = () => {
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);

  if (isPreviewMode) return undefined;

  return (
    <MantineAside
      width={{ base: ASIDE_WIDTH }}
      sx={{
        height: `calc(100% - ${HEADER_HEIGHT}px)`,
      }}
    >
      <MantineAside.Section grow component={ScrollArea}>
        <Box py="sm">
          <EditorAsideSections />
        </Box>
      </MantineAside.Section>
    </MantineAside>
  );
};

export const Aside = memo(AsideComponent);
