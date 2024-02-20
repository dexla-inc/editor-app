import { useAppMode } from "@/hooks/useAppMode";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { ICON_SIZE, NAVBAR_MIN_WIDTH, NAVBAR_WIDTH } from "@/utils/config";
import { Group, Switch, Tooltip, useMantineTheme } from "@mantine/core";
import { IconBrush, IconEye } from "@tabler/icons-react";

export const EditorPreviewModeToggle = () => {
  const theme = useMantineTheme();
  const { isPreviewMode } = useAppMode();
  const setPreviewModeConfig = useUserConfigStore(
    (state) => state.setPreviewMode,
  );
  const setPreviewModeEditor = useEditorStore((state) => state.setPreviewMode);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const setNavbarWidth = useUserConfigStore((state) => state.setNavbarWidth);

  return (
    <Tooltip
      label={isPreviewMode ? "Change to edit mode" : "Change to preview mode"}
      fz="xs"
    >
      <Group position="center">
        <Switch
          size="md"
          color={theme.colorScheme === "dark" ? "gray" : "teal"}
          onLabel={<IconBrush size={ICON_SIZE} color={theme.white} />}
          offLabel={<IconEye size={ICON_SIZE} color={theme.colors.teal[5]} />}
          checked={isPreviewMode}
          onChange={(event) => {
            const isPreviewMode = event.currentTarget.checked;
            setPreviewModeConfig(isPreviewMode);
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
