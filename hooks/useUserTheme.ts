import { Color } from "@/requests/themes/types";
import { ExtendedMantineThemeColors, useEditorStore } from "@/stores/editor";
import { defaultTheme } from "@/utils/branding";
import { useEffect, useState } from "react";
import { useProjectQuery } from "./reactQuery/useProjectQuery";

export const useUserTheme = (projectId: string) => {
  const setTheme = useEditorStore((state) => state.setTheme);
  const [internalTheme, setInternalTheme] = useState<any>(null);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const isLive = useEditorStore((state) => state.isLive);
  const project = useProjectQuery(projectId);
  const userTheme = project.data?.branding ?? defaultTheme;

  useEffect(() => {
    const updateTheme = async () => {
      if (project.isFetched) {
        const defaultFontFamily =
          userTheme?.defaultFont ?? defaultTheme.fontFamily ?? "Open Sans";
        const headingsFontFamily =
          userTheme?.fonts?.[0].fontFamily ??
          userTheme?.defaultFont ??
          defaultTheme.fontFamily ??
          "Open Sans";

        const WebFont = (await import("webfontloader")).default;

        WebFont.load({
          google: {
            families: [defaultFontFamily, headingsFontFamily],
          },
          context: isLive ? window : iframeWindow,
        });

        const colors = manipulateColors(userTheme?.colors);
        console.log("useUserTheme", colors);

        setInternalTheme({
          fontFamily: defaultFontFamily,
          fonts: userTheme?.fonts,
          headings: {
            fontFamily: headingsFontFamily,
            fontWeight: userTheme?.fonts?.[0].fontWeight ?? 500,
            sizes: userTheme?.fonts?.reduce((acc, font) => {
              return {
                ...acc,
                [font.tag.toLowerCase()]: {
                  fontSize: font.fontSize,
                  lineHeight: font.lineHeight,
                  fontWeight: font.fontWeight,
                },
              };
            }, {} as any),
          },
          colors: colors,
          primaryColor: "Primary",
          logoUrl: userTheme?.logoUrl,
          faviconUrl: userTheme?.faviconUrl,
          logos: userTheme?.logos,
          hasCompactButtons: userTheme?.hasCompactButtons,
          cardStyle: userTheme?.cardStyle,
          defaultFont: userTheme?.defaultFont,
          defaultSpacing: userTheme?.defaultSpacing ?? defaultTheme.spacing.md,
          defaultRadius: userTheme?.defaultRadius ?? defaultTheme.radius.md,
          theme: userTheme?.theme ?? defaultTheme.theme,
          inputSize: userTheme?.inputSize ?? defaultTheme.inputSize,
        });
      }
    };

    updateTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeWindow, isLive, project.isFetched]);

  useEffect(() => {
    if (internalTheme) {
      setTheme(internalTheme);
    }
  }, [internalTheme, setTheme]);

  return internalTheme;
};

const adjustColorShades = (colors: ExtendedMantineThemeColors) => {
  const adjustedColors = {} as ExtendedMantineThemeColors;
  Object.entries(colors).forEach(([key, value]) => {
    const baseColor = value[5];
    adjustedColors[key] = [
      defaultTheme.fn.lighten(baseColor, 0.6),
      defaultTheme.fn.lighten(baseColor, 0.5),
      defaultTheme.fn.lighten(baseColor, 0.4),
      defaultTheme.fn.lighten(baseColor, 0.3),
      defaultTheme.fn.lighten(baseColor, 0.2),
      defaultTheme.fn.lighten(baseColor, 0.1),
      baseColor,
      defaultTheme.fn.darken(baseColor, 0.1),
      defaultTheme.fn.darken(baseColor, 0.2),
      defaultTheme.fn.darken(baseColor, 0.3),
    ];
  });
  return adjustedColors;
};

function manipulateColors(
  userThemeColors: Color[] | ExtendedMantineThemeColors,
) {
  const isColorArray = Array.isArray(userThemeColors);

  if (isColorArray) {
    // Array way: userTheme?.colors is an array of Color
    return userThemeColors.reduce((userColors, color) => {
      const hex = color.hex.substring(0, 7);
      return {
        ...userColors,
        [color.name]: [
          defaultTheme.fn.lighten(hex, 0.9),
          defaultTheme.fn.lighten(hex, 0.8),
          defaultTheme.fn.lighten(hex, 0.7),
          defaultTheme.fn.lighten(hex, 0.6),
          defaultTheme.fn.lighten(hex, 0.5),
          defaultTheme.fn.lighten(hex, 0.4),
          color.hex,
          defaultTheme.fn.darken(hex, 0.1),
          defaultTheme.fn.darken(hex, 0.2),
          defaultTheme.fn.darken(hex, 0.3),
        ],
      };
    }, {});
  } else {
    // Object way: userTheme?.colors is an ExtendedMantineThemeColors
    // Assuming adjustColorShades is a function that adjusts the color shades appropriately
    return {
      ...adjustColorShades(userThemeColors),
    };
  }
}
