import { useEditorTreeStore } from "@/stores/editorTree";
import { CURSOR_COLORS } from "@/utils/config";
import { Avatar } from "@mantine/core";

export const OtherAvatars = () => {
  const liveblocks = useEditorTreeStore((state) => state.liveblocks);

  if (liveblocks.others.length === 0) return null;

  return (
    <Avatar.Group spacing="xs">
      {liveblocks.others.map(({ connectionId, presence }: any) => {
        if (!presence.currentUser) return null;

        return (
          <Avatar
            key={connectionId}
            src={presence.currentUser.pictureUrl}
            radius="xl"
            title={presence.currentUser.firstName}
            styles={{
              root: {
                border: `2px solid ${
                  CURSOR_COLORS[connectionId % CURSOR_COLORS.length]
                }`,
              },
            }}
          >
            {presence.currentUser.pictureUrl
              ? null
              : presence.currentUser.firstName[0]}
          </Avatar>
        );
      })}
    </Avatar.Group>
  );
};
