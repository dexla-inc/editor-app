import { useEditorStore } from "@/stores/editor";
import { getColorFromTheme } from "@/utils/editor";
import { useMemo } from "react";

type StateProps = {
  bg: string | undefined;
  textColor: string | undefined;
  isTransparentBackground?: boolean;
};

export const useChangeState = ({
  bg,
  textColor,
  isTransparentBackground,
}: StateProps) => {
  const theme = useEditorStore((state) => state.theme);
  const styles = useMemo(() => {
    const defaultBg = isTransparentBackground ? "transparent" : "white";
    const backgroundColor = getColorFromTheme(theme, bg) ?? defaultBg;
    const color = getColorFromTheme(theme, textColor) ?? "black";

    return {
      color,
      backgroundColor,
    };
  }, [bg, textColor, theme.colors]);

  return styles;
};
