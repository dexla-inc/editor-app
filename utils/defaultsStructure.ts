import { getColorFromTheme } from "@/utils/editor";

export const getDefaultBorderStyle = (theme: any) => {
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
};
