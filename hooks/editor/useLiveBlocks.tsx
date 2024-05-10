import { useEffect, useMemo, useState } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Cursor } from "@/components/Cursor";
import { CURSOR_COLORS } from "@/utils/config";
import { useLiveBlocksCursor } from "./useLiveBlocksCursor";

type UseLiveBlocksProps = {
  pageId: string;
};

export const useLiveBlocks = ({ pageId }: UseLiveBlocksProps) => {
  const liveblocks = useEditorTreeStore((state) => state.liveblocks);
  const [roomEntered, setRoomEntered] = useState(false);
  const setPageLoadTimestamp = useEditorTreeStore(
    (state) => state.setPageLoadTimestamp,
  );

  //const cursors = useLiveBlocksCursor({ pageId });

  useEffect(() => {
    setPageLoadTimestamp(Date.now());

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

  //return { cursors };
};
