import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { MantineThemeExtended } from "@/types/types";
import { convertThemeColors, defaultTheme } from "@/utils/branding";
import { Tuple } from "@mantine/core";
import { useEffect, useState } from "react";

export const useUserTheme = (projectId: string) => {
  const setTheme = useThemeStore((state) => state.setTheme);
  const [internalTheme, setInternalTheme] = useState<any>(null);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const isLive = useEditorTreeStore((state) => state.isLive);
  const project = useProjectQuery(projectId);

  useEffect(() => {
    const updateTheme = async () => {
      if (project.isFetched) {
        const projectBranding = project.data?.branding;
        const defaultFontFamily =
          projectBranding?.defaultFont ??
          defaultTheme.fontFamily ??
          "Open Sans";
        const headingsFontFamily =
          projectBranding?.fonts?.[0].fontFamily ??
          projectBranding?.defaultFont ??
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
          defaultSpacing:
            projectBranding?.defaultSpacing ?? defaultTheme.spacing.md,
          defaultRadius:
            projectBranding?.defaultRadius ?? defaultTheme.radius.md,
          theme: projectBranding?.theme ?? defaultTheme.theme,
          inputSize: projectBranding?.inputSize ?? defaultTheme.inputSize,
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

  return internalTheme as MantineThemeExtended;
};
