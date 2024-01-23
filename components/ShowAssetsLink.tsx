import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { Anchor } from "@mantine/core";

export const ShowAssetsLink = () => {
  const activeTab = useEditorStore((state) => state.activeTab);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);

  const isTheme = activeTab === "assets";
  const _val = isTabPinned ? "layers" : undefined;

  const openImageUploader = () => {
    setActiveTab(isTheme ? _val : "assets");
  };

  return (
    <Anchor
      component="button"
      type="button"
      onClick={openImageUploader}
      size="xs"
      sx={{ alignSelf: "self-start" }}
    >
      Show assets
    </Anchor>
  );
};
