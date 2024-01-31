import { useEditorStore } from "@/stores/editor";
import { inputSizes, radiusSizes } from "@/utils/defaultSizes";
import { getColorFromTheme } from "@/utils/editor";
import { useMemo } from "react";

export const useBrandingStyles = () => {
  const theme = useEditorStore((state) => state.theme);

  const { borderStyle, inputStyle, fontSizeStyle, buttonIconStyle } =
    useMemo(() => {
      const borderColor = getColorFromTheme(theme, "Border.6");
      const pTagFontSize =
        theme.fonts?.find((font) => font.tag === "P")?.fontSize + "px";

      const borderStyling = {
        borderRadius: radiusSizes[theme.defaultRadius],
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: borderColor,
        borderTopColor: borderColor,
        borderBottomColor: borderColor,
        borderLeftColor: borderColor,
        borderRightColor: borderColor,
      };

      const inputStyling = {
        fontSize: pTagFontSize,
        height: inputSizes[theme.inputSize],
        borderRadius: radiusSizes[theme.defaultRadius],
      };

      const fontSizeStyling = {
        fontSize: pTagFontSize,
      };

      const buttonIconStyling = {
        height: inputSizes[theme.inputSize],
        width: inputSizes[theme.inputSize],
        borderRadius: radiusSizes[theme.defaultRadius],
      };

      return {
        borderStyle: borderStyling,
        inputStyle: inputStyling,
        fontSizeStyle: fontSizeStyling,
        buttonIconStyle: buttonIconStyling,
      };
    }, [theme]);

  return {
    borderStyle,
    inputStyle,
    fontSizeStyle,
    buttonIconStyle,
  };
};
