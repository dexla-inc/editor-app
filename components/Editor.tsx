// The comment below force next to refresh the editor state every time we change something in the code
// @refresh reset
import { Shell } from "@/components/AppShell";
import { Cursor } from "@/components/Cursor";
import { EditorCanvas } from "@/components/EditorCanvas";
import { EditorAsideSections } from "@/components/aside/EditorAsideSections";
import { EditorNavbarSections } from "@/components/navbar/EditorNavbarSections";
import { useAppMode } from "@/hooks/useAppMode";
import { useGetPageData } from "@/hooks/useGetPageData";
import { useEditorStore } from "@/stores/editor";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { useUserConfigStore } from "@/stores/userConfig";
import { globalStyles } from "@/utils/branding";
import {
  ASIDE_WIDTH,
  CURSOR_COLORS,
  HEADER_HEIGHT,
  NAVBAR_MIN_WIDTH,
  NAVBAR_WIDTH,
} from "@/utils/config";
import { Aside, Box, Global, Navbar, ScrollArea } from "@mantine/core";
import { useEffect } from "react";

type Props = {
  projectId: string;
  pageId: string;
};

export const Editor = ({ projectId, pageId }: Props) => {
  const setCurrentPageAndProjectIds = useEditorStore(
    (state) => state.setCurrentPageAndProjectIds,
  );
  const liveblocks = useEditorStore((state) => state.liveblocks);
  const { isPreviewMode } = useAppMode();
  const isNavBarVisible = useEditorStore((state) => state.isNavBarVisible);
  const setCurrentUser = useEditorStore((state) => state.setCurrentUser);
  const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);
  const user = usePropelAuthStore((state) => state.user);

  useGetPageData({ projectId, pageId });
  setCurrentPageAndProjectIds(projectId, pageId);

  useEffect(() => {
    if (pageId) {
      liveblocks.enterRoom(pageId);
    }

    return () => {
      if (liveblocks.status === "connected") liveblocks.leaveRoom();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  useEffect(() => {
    setCurrentUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
              <Navbar.Section grow py="sm">
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
        <EditorCanvas projectId={projectId} />
      </Shell>
      {liveblocks.others.map(({ connectionId, presence }) => {
        const cursor = presence.cursor as { x: number; y: number };
        // @ts-ignore
        const firstName = presence?.currentUser?.firstName ?? "Anonymous";

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
            name={firstName}
          />
        );
      })}
    </>
  );
};
