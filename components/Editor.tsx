// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { Shell } from "@/components/AppShell";
import { EditorCanvas } from "@/components/EditorCanvas";
import { EditorAsideSections } from "@/components/aside/EditorAsideSections";
import { EditorNavbarSections } from "@/components/navbar/EditorNavbarSections";
import { defaultPageState, useGetPageData } from "@/hooks/useGetPageData";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { globalStyles } from "@/utils/branding";
import {
  ASIDE_WIDTH,
  HEADER_HEIGHT,
  NAVBAR_MIN_WIDTH,
  NAVBAR_WIDTH,
} from "@/utils/config";
import {
  Aside,
  Box,
  Button,
  Global,
  Loader,
  Navbar,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

type Props = {
  projectId: string;
  pageId: string;
};

export const Editor = ({ projectId, pageId }: Props) => {
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const isNavBarVisible = useEditorStore((state) => state.isNavBarVisible);

  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);

  useGetPageData({ projectId, pageId });

  const queryClient = useQueryClient();

  const cancelGeneratePage = useCallback(() => {
    stopLoading({
      id: "page-generation",
      title: "Page Cancelled",
      message: "You can build from scratch",
      isError: true,
    });
    queryClient.cancelQueries({ queryKey: ["page"] });
    setEditorTree(defaultPageState, {
      onLoad: true,
      action: "Initial State",
    });
    setIsLoading(false);
    // we don't unnnecessary rerendering of the editor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setEditorTree]);

  return (
    <>
      <Shell
        pos="relative"
        navbar={
          !isPreviewMode && isNavBarVisible ? (
            <Navbar
              miw={{ base: NAVBAR_MIN_WIDTH }}
              width={{ base: NAVBAR_MIN_WIDTH }}
              maw={{ base: NAVBAR_WIDTH }}
              sx={{
                height: `calc(100% - ${HEADER_HEIGHT}px)`,
                zIndex: 300,
              }}
            >
              <Navbar.Section grow component={ScrollArea} py="sm">
                <EditorNavbarSections />
              </Navbar.Section>
            </Navbar>
          ) : undefined
        }
        aside={
          !isPreviewMode ? (
            <Aside
              width={{ base: ASIDE_WIDTH }}
              sx={{
                height: `calc(100% - ${HEADER_HEIGHT}px)`,
              }}
            >
              <Aside.Section grow component={ScrollArea}>
                <Box py="sm">
                  <EditorAsideSections />
                </Box>
              </Aside.Section>
            </Aside>
          ) : undefined
        }
      >
        <Global styles={globalStyles(isDarkTheme)} />
        {isLoading && editorTree.root.children?.length === 0 && (
          <Box
            pos="relative"
            style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}
            ml={isTabPinned ? NAVBAR_WIDTH : NAVBAR_MIN_WIDTH - 50} // Weird sizing issue that I haven't got time to investigate, had to hack it
            p={"40px 10px"}
          >
            <Paper
              pos="relative"
              shadow="xs"
              bg="white"
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

              <Button
                color="red"
                pos="absolute"
                bottom={30}
                type="button"
                onClick={cancelGeneratePage}
              >
                Cancel
              </Button>
            </Paper>
          </Box>
        )}
        <EditorCanvas projectId={projectId} />
      </Shell>
    </>
  );
};
