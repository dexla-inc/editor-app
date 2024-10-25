import { Shell } from "@/components/AppShell";
import { Cursor } from "@/components/Cursor";
import { EditorCanvas as EditorCanvasGrid } from "@/libs/dnd-grid/components/EditorCanvas";
import { EditorCanvas as EditorCanvasFlex } from "@/libs/dnd-flex/components/EditorCanvas";
import { useGetPageData } from "@/hooks/editor/reactQuery/useGetPageData";
import { useEditorTreeStore } from "@/stores/editorTree";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { useUserConfigStore } from "@/stores/userConfig";
import { globalStyles } from "@/utils/branding";
import { CURSOR_COLORS } from "@/utils/config";
import { Global } from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { useInputsStore } from "@/stores/inputs";
import { withPageOnLoad } from "@/hoc/withPageOnLoad";
import { CustomComponentModal } from "@/components/CustomComponentModal";
import { CssTypes } from "@/types/types";

type Props = {
  projectId: string;
  pageId: string;
  cssType: CssTypes;
};

const Editor = ({ projectId, pageId, cssType }: Props) => {
  const setCurrentPageAndProjectIds = useEditorTreeStore(
    (state) => state.setCurrentPageAndProjectIds,
  );
  const liveblocks = useEditorTreeStore((state) => state.liveblocks);
  const setCurrentUser = useEditorTreeStore((state) => state.setCurrentUser);
  const _cssType = useEditorTreeStore((state) => state.cssType);
  const setCssType = useEditorTreeStore((state) => state.setCssType);
  const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);
  const user = usePropelAuthStore((state) => state.user);
  const setPageLoadTimestamp = useEditorTreeStore(
    (state) => state.setPageLoadTimestamp,
  );
  const resetInputValues = useInputsStore((state) => state.resetInputValues);
  const isCustomComponentModalOpen = useUserConfigStore(
    (state) => state.isCustomComponentModalOpen,
  );

  useGetPageData({ projectId, pageId });

  const [roomEntered, setRoomEntered] = useState(false);

  useEffect(() => {
    setCurrentPageAndProjectIds(projectId, pageId);
    setCssType(cssType);
    setPageLoadTimestamp(Date.now());
    resetInputValues();

    if (pageId && !roomEntered) {
      liveblocks.enterRoom(pageId);
      setRoomEntered(true);
    }

    return () => {
      if (liveblocks.status === "connected") {
        liveblocks.leaveRoom();
        setRoomEntered(false);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, cssType]);

  useEffect(() => {
    setCurrentUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <Shell pos="relative" projectId={projectId}>
        <Global styles={globalStyles(isDarkTheme)} />
        {_cssType === "GRID" ? (
          <EditorCanvasGrid projectId={projectId} />
        ) : (
          <EditorCanvasFlex projectId={projectId} />
        )}
        {isCustomComponentModalOpen && (
          <CustomComponentModal
            isCustomComponentModalOpen={isCustomComponentModalOpen}
          />
        )}
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

export default withPageOnLoad<Props>(memo(Editor));
