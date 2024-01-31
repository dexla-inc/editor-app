import { useGetThemeQuery } from "@/hooks/reactQuery/useThemeQuery";
import { useEditorStore } from "@/stores/editor";
import { defaultTheme } from "@/utils/branding";
import { useEffect, useState } from "react";

export const useUserTheme = (projectId: string) => {
  const setTheme = useEditorStore((state) => state.setTheme);
  const [internalTheme, setInternalTheme] = useState<any>(null);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const isLive = useEditorStore((state) => state.isLive);
  const userTheme = useGetThemeQuery(projectId);

  useEffect(() => {
    const updateTheme = async () => {
      if (userTheme.isFetched) {
        const defaultFontFamily =
          userTheme.data?.defaultFont ?? defaultTheme.fontFamily ?? "Open Sans";
        const headingsFontFamily =
          userTheme.data?.fonts?.[0].fontFamily ??
          userTheme.data?.defaultFont ??
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
          fonts: userTheme.data?.fonts,
          headings: {
            fontFamily: headingsFontFamily,
            fontWeight: userTheme.data?.fonts?.[0].fontWeight ?? 500,
            sizes: userTheme.data?.fonts?.reduce((acc, font) => {
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
            ...userTheme.data?.colors.reduce((userColors, color) => {
              const hex = color.hex.substring(0, 7);
              const colorShades =
                color.name === "White"
                  ? [color.hex]
                  : [
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
                    ];

              return {
                ...userColors,
                [color.name]: colorShades,
              };
            }, {}),
          },
          primaryColor: "Primary",
          logoUrl: userTheme.data?.logoUrl,
          faviconUrl: userTheme.data?.faviconUrl,
          logos: userTheme.data?.logos,
          hasCompactButtons: userTheme.data?.hasCompactButtons,
          cardStyle: userTheme.data?.cardStyle,
          defaultFont: userTheme.data?.defaultFont,
          defaultSpacing:
            userTheme.data?.defaultSpacing ?? defaultTheme.spacing.md,
          defaultRadius:
            userTheme.data?.defaultRadius ?? defaultTheme.radius.md,
          theme: userTheme.data?.theme ?? defaultTheme.theme,
          inputSize: userTheme.data?.inputSize ?? defaultTheme.inputSize,
        });
      }
    };

    updateTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeWindow, isLive, userTheme.isFetched]);

  useEffect(() => {
    if (internalTheme) {
      setTheme(internalTheme);
    }
  }, [internalTheme, setTheme]);

  return internalTheme;
};
