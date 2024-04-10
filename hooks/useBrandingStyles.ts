import { useThemeStore } from "@/stores/theme";
import { inputSizes, radiusSizes } from "@/utils/defaultSizes";
import { getColorFromTheme } from "@/utils/editor";

type Props = {
  tag?: string;
};

export const useBrandingStyles = ({ tag = "P" }: Props = {}) => {
  const theme = useThemeStore((state) => state.theme);
  const borderColor = getColorFromTheme(theme, "Border.6");
  // TODO: Need to be able to support multiple texts
  const textFont = theme.fonts?.find((font) => font.tag === tag);
  const fontSize = textFont?.fontSize + "px";
  const buttonFont = theme.fonts.find((font) => font.tag === "Button");
  const inputSize = inputSizes[theme.inputSize];
  const radiusSize = radiusSizes[theme.defaultRadius];

  const borderStyle = {
    borderRadius: radiusSize,
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: borderColor,
    borderTopColor: borderColor,
    borderBottomColor: borderColor,
    borderLeftColor: borderColor,
    borderRightColor: borderColor,
  };

  const dashedBorderStyle = {
    ...borderStyle,
    borderStyle: "dashed",
    borderWidth: "2px",
  };

  const inputStyle = {
    fontSize: fontSize,
    height: inputSize,
    borderRadius: radiusSize,
  };

  const fontSizeStyle = {
    fontSize: fontSize,
  };

  const buttonIconStyle = {
    height: inputSize,
    width: inputSize,
    borderRadius: radiusSize,
  };

  const buttonStyle = {
    height: inputSize,
    borderRadius: radiusSize,
    ...(buttonFont && {
      fontSize: buttonFont?.fontSize,
      fontWeight: buttonFont?.fontWeight,
      lineHeight: buttonFont?.lineHeight,
      letterSpacing: buttonFont?.letterSpacing,
    }),
  };

  const textStyle = {
    ...(fontSize && {
      fontSize: fontSize,
      fontWeight: textFont?.fontWeight,
      lineHeight: textFont?.lineHeight,
      letterSpacing: textFont?.letterSpacing,
    }),
  };

  const titleStyle = {
    fontSize: textFont?.fontSize,
    fontWeight: textFont?.fontWeight,
    lineHeight: textFont?.lineHeight,
    letterSpacing: textFont?.letterSpacing,
    fontFamily: textFont?.fontFamily,
  };

  const avatarStyle = {
    root: {
      height: inputSize,
      width: inputSize,
    },
    borderRadius: radiusSize,
  };

  return {
    borderStyle,
    inputStyle,
    fontSizeStyle,
    buttonIconStyle,
    buttonStyle,
    textStyle,
    titleStyle,
    avatarStyle,
    dashedBorderStyle,
  };
};

const calcSize = (size: string, factor: number) => {
  const numericSize = parseInt(size, 10);
  const newSize = numericSize * factor;
  return `${newSize}px`;
};
