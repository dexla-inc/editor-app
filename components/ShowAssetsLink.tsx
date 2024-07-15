import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { Anchor } from "@mantine/core";

export const ShowAssetsLink = () => {
  const setActiveTab = useEditorStore((state) => state.setActiveTab);

  const openImageUploader = () => {
    const isTheme = useEditorStore.getState().activeTab === "assets";
    const _val = useUserConfigStore.getState().isTabPinned
      ? "layers"
      : undefined;
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
