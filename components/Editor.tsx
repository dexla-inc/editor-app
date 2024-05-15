import { Shell } from "@/components/AppShell";
import { Cursor } from "@/components/Cursor";
import { EditorCanvas } from "@/components/EditorCanvas";
import { useGetPageData } from "@/hooks/reactQuery/useGetPageData";
import { useEditorTreeStore } from "@/stores/editorTree";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { useUserConfigStore } from "@/stores/userConfig";
import { globalStyles } from "@/utils/branding";
import { CURSOR_COLORS } from "@/utils/config";
import { Global } from "@mantine/core";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Aside } from "@/components/aside/Aside";
import { useInputsStore } from "@/stores/inputs";

type Props = {
  projectId: string;
  pageId: string;
};

const Editor = ({ projectId, pageId }: Props) => {
  const setCurrentPageAndProjectIds = useEditorTreeStore(
    (state) => state.setCurrentPageAndProjectIds,
  );
  const liveblocks = useEditorTreeStore((state) => state.liveblocks);
  const setCurrentUser = useEditorTreeStore((state) => state.setCurrentUser);
  const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);
  const user = usePropelAuthStore((state) => state.user);
  const setPageLoadTimestamp = useEditorTreeStore(
    (state) => state.setPageLoadTimestamp,
  );
  const resetInputValues = useInputsStore((state) => state.resetInputValues);

  useGetPageData({ projectId, pageId });
  const [roomEntered, setRoomEntered] = useState(false);

  useEffect(() => {
    setCurrentPageAndProjectIds(projectId, pageId);
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
  }, [pageId]);

  useEffect(() => {
    setCurrentUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <Shell pos="relative" navbar={<Navbar />} aside={<Aside />}>
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

export default Editor;
