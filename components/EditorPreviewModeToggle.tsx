import { useEditorTreeStore } from "@/stores/editorTree";
import { useUserConfigStore } from "@/stores/userConfig";
import { ICON_SIZE, NAVBAR_MIN_WIDTH, NAVBAR_WIDTH } from "@/utils/config";
import { Group, Switch, Tooltip, useMantineTheme } from "@mantine/core";
import { IconBrush, IconEye } from "@tabler/icons-react";

export const EditorPreviewModeToggle = () => {
  const theme = useMantineTheme();
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
  const setPreviewModeEditor = useEditorTreeStore(
    (state) => state.setPreviewMode,
  );
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const setNavbarWidth = useUserConfigStore((state) => state.setNavbarWidth);

  return (
    <Tooltip label={isPreviewMode ? "Edit mode" : "Preview mode"} fz="xs">
      <Group position="center">
        <Switch
          size="md"
          color={theme.colorScheme === "dark" ? "gray" : "teal"}
          onLabel={<IconBrush size={ICON_SIZE} color={theme.white} />}
          offLabel={<IconEye size={ICON_SIZE} color={theme.colors.teal[5]} />}
          checked={isPreviewMode}
          onChange={(event) => {
            const isPreviewMode = event.currentTarget.checked;
            setPreviewModeEditor(isPreviewMode);
            setNavbarWidth(
              isTabPinned && isPreviewMode
                ? 0
                : isTabPinned
                ? NAVBAR_WIDTH
                : NAVBAR_MIN_WIDTH,
            );
          }}
        />
      </Group>
    </Tooltip>
  );
};
