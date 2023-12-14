import { getTheme } from "@/requests/themes/queries";
import { useEditorStore } from "@/stores/editor";
import { defaultTheme } from "@/utils/branding";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useUserTheme = (projectId: string) => {
  const setTheme = useEditorStore((state) => state.setTheme);
  const [internalTheme, setInternalTheme] = useState<any>(null);

  const userTheme = useQuery({
    queryKey: ["theme"],
    queryFn: () => getTheme(projectId),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (userTheme.isFetched) {
      setInternalTheme({
        fontFamily: userTheme.data?.defaultFont ?? defaultTheme.fontFamily,
        headings: {
          fontFamily:
            userTheme.data?.fonts?.[0].fontFamily ??
            userTheme.data?.defaultFont ??
            defaultTheme.fontFamily,
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
        // @ts-ignore
        colors: {
          ...userTheme.data?.colors.reduce((userColors, color) => {
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
        defaultRadius: userTheme.data?.defaultRadius ?? defaultTheme.radius.md,
        theme: userTheme.data?.theme ?? defaultTheme.theme,
      });
    }
  }, [
    setTheme,
    userTheme.data?.cardStyle,
    userTheme.data?.colors,
    userTheme.data?.defaultFont,
    userTheme.data?.defaultRadius,
    userTheme.data?.defaultSpacing,
    userTheme.data?.faviconUrl,
    userTheme.data?.fonts,
    userTheme.data?.hasCompactButtons,
    userTheme.data?.logoUrl,
    userTheme.data?.logos,
    userTheme.data?.theme,
    userTheme.isFetched,
  ]);

  useEffect(() => {
    if (internalTheme) {
      setTheme(internalTheme);
    }
  }, [internalTheme, setTheme]);

  return internalTheme;
};
