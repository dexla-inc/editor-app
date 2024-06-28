import { useEditorStore } from "@/stores/editor";
import { useThemeStore } from "@/stores/theme";
import { defaultTheme } from "@/utils/branding";
import { useEffect, useState } from "react";
import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import { useEditorTreeStore } from "@/stores/editorTree";
import { MantineThemeExtended } from "@/types/types";

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
