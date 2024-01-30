import { useEditorStore } from "@/stores/editor";
import { getColorFromTheme } from "@/utils/editor";
import { useMemo } from "react";

export const useDefaultBorderStyle = () => {
  const theme = useEditorStore((state) => state.theme);
  const borderStyle = useMemo(() => {
    const borderColor = getColorFromTheme(theme, "Border.6");
    return {
      borderRadius: "4px",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: borderColor,
      borderTopColor: borderColor,
      borderBottomColor: borderColor,
      borderLeftColor: borderColor,
      borderRightColor: borderColor,
    };
  }, [theme]);

  return { borderStyle };
};
