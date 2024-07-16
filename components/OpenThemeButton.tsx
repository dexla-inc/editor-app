import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { Anchor } from "@mantine/core";

export const OpenThemeButton = () => {
  const setActiveTab = useEditorStore((state) => state.setActiveTab);

  const onClick = () => {
    const isTheme = useEditorStore.getState().activeTab === "theme";
    const _val = useUserConfigStore.getState().isTabPinned
      ? "layers"
      : undefined;
    setActiveTab(isTheme ? _val : "theme");
  };

  return (
    <Anchor
      component="button"
      type="button"
      onClick={onClick}
      size="xs"
      sx={{ alignSelf: "self-start" }}
    >
      Add new color
    </Anchor>
  );
};
