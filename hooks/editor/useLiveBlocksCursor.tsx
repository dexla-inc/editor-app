import { useMemo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Cursor } from "@/components/Cursor";
import { CURSOR_COLORS } from "@/utils/config";

type UseLiveBlocksProps = {
  pageId: string;
};

export const useLiveBlocksCursor = ({ pageId }: UseLiveBlocksProps) => {
  const liveblocks = useEditorTreeStore((state) => state.liveblocks);

  const cursors = useMemo(
    () =>
      liveblocks.others.map(({ connectionId, presence }) => {
        const cursor = presence.cursor as { x: number; y: number };
        // @ts-ignore
        const firstName = presence?.currentUser?.firstName ?? "Anonymous";
        if (!cursor) return null;

        return (
          <Cursor
            key={`cursor-${connectionId}`}
            color={CURSOR_COLORS[connectionId % CURSOR_COLORS.length]}
            x={cursor.x}
            y={cursor.y}
            name={firstName}
          />
        );
      }),
    [liveblocks.others],
  );

  return cursors;
};
