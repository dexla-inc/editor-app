import { defaultTheme } from "@/utils/branding";
import { MantineThemeExtended } from "@/types/types";
import { ThemeResponse } from "@/requests/themes/types";
// import { poppins } from "@/app/globalProviders";

export const prepareUserThemeLive = (projectBranding: ThemeResponse) => {
  // const defaultFontFamily =
  //   projectBranding?.defaultFont ??
  //   defaultTheme.fontFamily ??
  //   "Open Sans";
  const defaultFontFamily = "var(--font-poppins) !important";
  // const headingsFontFamily =
  //   projectBranding?.fonts?.[0].fontFamily ??
  //   projectBranding?.defaultFont ??
  //   defaultTheme.fontFamily ??
  //   "Open Sans";
  const headingsFontFamily = "var(--font-poppins) !important";

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
    // @ts-ignore
    colors: {
      ...projectBranding?.colors.reduce((userColors, color) => {
        const hex = color.hex.substring(0, 7);
        return {
          ...userColors,
          [color.name]: [
            defaultTheme.fn.lighten(hex, 0.9),
            defaultTheme.fn.lighten(hex, 0.8),
            defaultTheme.fn.lighten(hex, 0.7),
            defaultTheme.fn.lighten(hex, 0.6),
            defaultTheme.fn.lighten(hex, 0.5),
            color.hex.startsWith("#000000")
              ? "#323232"
              : defaultTheme.fn.lighten(hex, 0.4), // Custom hover for black
            color.hex,
            color.hex.startsWith("#FFFFFF")
              ? "#F5F8F8"
              : defaultTheme.fn.darken(hex, 0.1), // Custom hover for white
            defaultTheme.fn.darken(hex, 0.2),
            defaultTheme.fn.darken(hex, 0.3),
          ],
        };
      }, {}),
    },
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
