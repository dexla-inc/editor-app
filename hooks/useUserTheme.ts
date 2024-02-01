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
          colors: {
            ...adjustColorShades(
              userTheme?.colors as ExtendedMantineThemeColors,
            ),
          },
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
