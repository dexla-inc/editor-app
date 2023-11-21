import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { UnstyledButton } from "@mantine/core";

export const OpenThemeButton = () => {
  const theme = useEditorStore((state) => state.theme);
  const activeTab = useEditorStore((state) => state.activeTab);
  const isTabPinned = useUserConfigStore((state) => state.isTabPinned);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);

  const isTheme = activeTab === "theme";
  const _val = isTabPinned ? "layers" : undefined;
  return (
    <UnstyledButton
      sx={{
        ":hover": { textDecoration: "underline", color: theme.colors.gray[9] },
        color: theme.colors.gray[6],
        transition: "all 200ms ease",
      }}
      fz="xs"
      onClick={() => setActiveTab(isTheme ? _val : "theme")}
    >
      Add new color
    </UnstyledButton>
  );
};
