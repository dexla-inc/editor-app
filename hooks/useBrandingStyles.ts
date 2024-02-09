import { useEditorStore } from "@/stores/editor";
import { inputSizes, radiusSizes } from "@/utils/defaultSizes";
import { getColorFromTheme } from "@/utils/editor";

export const useBrandingStyles = () => {
  const theme = useEditorStore((state) => state.theme);
  const borderColor = getColorFromTheme(theme, "Border.6");
  const pTagFontSize =
    theme.fonts?.find((font) => font.tag === "P")?.fontSize + "px";
  const buttonFont = theme.fonts.find((font) => font.tag === "Button");

  const borderStyle = {
    borderRadius: radiusSizes[theme.defaultRadius],
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: borderColor,
    borderTopColor: borderColor,
    borderBottomColor: borderColor,
    borderLeftColor: borderColor,
    borderRightColor: borderColor,
  };

  const inputStyle = {
    fontSize: pTagFontSize,
    height: inputSizes[theme.inputSize],
    borderRadius: radiusSizes[theme.defaultRadius],
  };

  const fontSizeStyle = {
    fontSize: pTagFontSize,
  };

  const buttonIconStyle = {
    height: inputSizes[theme.inputSize],
    width: inputSizes[theme.inputSize],
    borderRadius: radiusSizes[theme.defaultRadius],
  };

  const buttonStyle = {
    height: inputSizes[theme.inputSize],
    borderRadius: radiusSizes[theme.defaultRadius],
    ...(buttonFont && {
      fontSize: buttonFont?.fontSize,
      fontWeight: buttonFont?.fontWeight,
      lineHeight: buttonFont?.lineHeight,
      letterSpacing: buttonFont?.letterSpacing,
    }),
  };

  return {
    borderStyle,
    inputStyle,
    fontSizeStyle,
    buttonIconStyle,
    buttonStyle,
  };
};
