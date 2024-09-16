import { ThemeResponse } from "@/requests/themes/types";
import { MantineThemeExtended } from "@/types/types";
import { convertThemeColors, defaultTheme } from "@/utils/branding";
import { Tuple } from "@mantine/core";

export const prepareUserThemeLive = (projectBranding: ThemeResponse) => {
  const defaultFontFamily =
    projectBranding?.defaultFont ?? defaultTheme.fontFamily ?? "Open Sans";
  const headingsFontFamily =
    projectBranding?.fonts?.[0].fontFamily ??
    projectBranding?.defaultFont ??
    defaultTheme.fontFamily ??
    "Open Sans";

  // @ts-ignore
  const userTheme: MantineThemeExtended = {
    fontFamily: defaultFontFamily,
    fonts: projectBranding?.fonts,
    headings: {
      fontFamily: headingsFontFamily,
      fontWeight: projectBranding?.fonts?.[0].fontWeight ?? 500,
      sizes: projectBranding?.fonts?.reduce((acc, font) => {
        return {
          ...acc,
          [font.tag?.toLowerCase()]: {
            fontSize: font.fontSize,
            lineHeight: font.lineHeight,
            fontWeight: font.fontWeight,
          },
        };
      }, {} as any),
    },
    colors: convertThemeColors(projectBranding, true).reduce(
      (acc, colorFamily) => {
        const hexColors = colorFamily.colors.map((color) => color.hex);
        acc[colorFamily.family] = hexColors as Tuple<string, 10>;
        return acc;
      },
      {} as typeof defaultTheme.colors,
    ),
    primaryColor: "Primary",
    logoUrl: projectBranding?.logoUrl,
    faviconUrl: projectBranding?.faviconUrl,
    logos: projectBranding?.logos,
    hasCompactButtons: projectBranding?.hasCompactButtons,
    cardStyle: projectBranding?.cardStyle,
    defaultFont: projectBranding?.defaultFont,
    defaultSpacing: projectBranding?.defaultSpacing ?? defaultTheme.spacing.md,
    defaultRadius: projectBranding?.defaultRadius ?? defaultTheme.radius.md,
    theme: projectBranding?.theme ?? defaultTheme.theme,
    inputSize: projectBranding?.inputSize ?? defaultTheme.inputSize,
  };

  return userTheme;
};
