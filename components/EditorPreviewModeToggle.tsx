import { useAppMode } from "@/hooks/useAppMode";
import { useUserConfigStore } from "@/stores/userConfig";
import { ICON_SIZE } from "@/utils/config";
import { Group, Switch, Tooltip, useMantineTheme } from "@mantine/core";
import { IconBrush, IconEye } from "@tabler/icons-react";

export const EditorPreviewModeToggle = () => {
  const theme = useMantineTheme();
  const isPreviewMode = useAppMode();
  const setPreviewMode = useUserConfigStore((state) => state.setPreviewMode);

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
            setPreviewMode(isPreviewMode);
          }}
        />
      </Group>
    </Tooltip>
  );
};
