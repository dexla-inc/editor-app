// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { Shell } from "@/components/AppShell";
import { Cursor } from "@/components/Cursor";
import { EditorCanvas } from "@/components/EditorCanvas";
import { EditorAsideSections } from "@/components/aside/EditorAsideSections";
import { EditorNavbarSections } from "@/components/navbar/EditorNavbarSections";
import { defaultPageState, useGetPageData } from "@/hooks/useGetPageData";
import { listVariables } from "@/requests/variables/queries-noauth";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { useUserConfigStore } from "@/stores/userConfig";
import { useVariableStore } from "@/stores/variables";
import { globalStyles } from "@/utils/branding";
import {
  ASIDE_WIDTH,
  CURSOR_COLORS,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

type Props = {
  projectId: string;
  pageId: string;
};

export const Editor = ({ projectId, pageId }: Props) => {
  const liveblocks = useEditorStore((state) => state.liveblocks);
  const editorTree = useEditorStore((state) => state.tree);
  const setEditorTree = useEditorStore((state) => state.setTree);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const isNavBarVisible = useEditorStore((state) => state.isNavBarVisible);
  const setCurrentUser = useEditorStore((state) => state.setCurrentUser);

  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);
  const user = usePropelAuthStore((state) => state.user);
  const initializeVariableList = useVariableStore(
    (state) => state.initializeVariableList,
  );

  useGetPageData({ projectId, pageId });

  const queryClient = useQueryClient();

  const { data: variables, isLoading: isVariablesFetching } = useQuery({
    queryKey: ["variables", projectId, pageId],
    queryFn: async () => {
      return await listVariables(projectId, { pageId });
    },
    enabled: !!projectId && !!pageId,
  });

  useEffect(() => {
    setIsLoading(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (pageId) {
      liveblocks.leaveRoom();
      liveblocks.enterRoom(pageId);
      if (!isVariablesFetching && variables) {
        initializeVariableList(variables);
      }
    }

    return () => {
      liveblocks.leaveRoom();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  useEffect(() => {
    setCurrentUser(user);
  }, [user, setCurrentUser]);

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
      {
        /**
         * Iterate over other users and display a cursor based on their presence
         */
        liveblocks.others.map(({ connectionId, presence }) => {
          const cursor = presence.cursor as { x: number; y: number };
          if (!cursor) {
            return null;
          }

          return (
            <Cursor
              key={`cursor-${connectionId}`}
              // connectionId is an integer that is incremented at every new connections
              // Assigning a color with a modulo makes sure that a specific user has the same colors on every clients
              color={CURSOR_COLORS[connectionId % CURSOR_COLORS.length]}
              x={cursor.x}
              y={cursor.y}
              name={user.firstName ?? ""}
            />
          );
        })
      }
    </>
  );
};
