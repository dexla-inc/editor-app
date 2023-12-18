import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { Anchor } from "@mantine/core";

export const OpenThemeButton = () => {
  const theme = useEditorStore((state) => state.theme);
  const activeTab = useEditorStore((state) => state.activeTab);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);

  const isTheme = activeTab === "theme";
  const _val = isTabPinned ? "layers" : undefined;
  return (
    <Anchor
      component="button"
      type="button"
      onClick={() => setActiveTab(isTheme ? _val : "theme")}
      size="xs"
      sx={{ alignSelf: "self-start" }}
    >
      Add new color
    </Anchor>
  );
};
