import { useEditorStore } from "@/stores/editor";
import { ICON_MEDIUM_SIZE } from "@/utils/config";
import { Group, Switch, useMantineTheme } from "@mantine/core";
import { IconBrush, IconEye } from "@tabler/icons-react";

type EditorPreviewModeToggleProps = {
  isPreviewMode: boolean;
  setPreviewMode: (value: boolean) => void;
};

export const EditorPreviewModeToggle = ({
  isPreviewMode = false,
  setPreviewMode,
}: EditorPreviewModeToggleProps) => {
  const theme = useMantineTheme();
  const resetOnMountActionsRan = useEditorStore(
    (state) => state.resetOnMountActionsRan
  );

  return (
    <Group position="center">
      <Switch
        size="lg"
        color={theme.colorScheme === "dark" ? "gray" : "teal"}
        onLabel={<IconBrush size={ICON_MEDIUM_SIZE} color={theme.white} />}
        offLabel={
          <IconEye size={ICON_MEDIUM_SIZE} color={theme.colors.teal[5]} />
        }
        checked={isPreviewMode}
        onChange={(event) => {
          const isPreviewMode = event.currentTarget.checked;
          setPreviewMode(isPreviewMode);
          resetOnMountActionsRan();
        }}
      />
    </Group>
  );
};
