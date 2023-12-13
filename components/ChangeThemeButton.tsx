import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useUserConfigStore } from "@/stores/userConfig";

export const ChangeThemeButton = () => {
  const isDarkTheme = useUserConfigStore((state) => state.isDarkTheme);
  const setIsDarkTheme = useUserConfigStore((state) => state.setIsDarkTheme);
  const handleClick = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  const TOOLTIP = isDarkTheme ? "Light Mode" : "Dark Mode";
  const ICON = isDarkTheme ? "IconSun" : "IconMoon";

  return (
    <ActionIconDefault
      iconName={ICON}
      tooltip={TOOLTIP}
      onClick={handleClick}
    />
  );
};
