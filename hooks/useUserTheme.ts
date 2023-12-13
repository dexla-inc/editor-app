import { getTheme } from "@/requests/themes/queries";
import { useEditorStore } from "@/stores/editor";
import { defaultTheme } from "@/utils/branding";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useUserTheme = (projectId: string) => {
  const theme = useEditorStore((state) => state.theme);
  const setTheme = useEditorStore((state) => state.setTheme);

  const userTheme = useQuery({
    queryKey: ["theme"],
    queryFn: () => getTheme(projectId),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (userTheme.isFetched) {
      setTheme({
        ...theme,
        colors: {
          ...theme.colors,
          ...userTheme.data?.colors.reduce((userColors, color) => {
            const hex = color.hex.substring(0, 7);
            return {
              ...userColors,
              [color.name]: [
                theme.fn.lighten(hex, 0.9),
                theme.fn.lighten(hex, 0.8),
                theme.fn.lighten(hex, 0.7),
                theme.fn.lighten(hex, 0.6),
                theme.fn.lighten(hex, 0.5),
                theme.fn.lighten(hex, 0.4),
                color.hex,
                theme.fn.darken(hex, 0.1),
                theme.fn.darken(hex, 0.2),
                theme.fn.darken(hex, 0.3),
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
        // loader: userTheme.data?.loader?
        // focusRing: userTheme.data?.focusRing,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTheme.isFetched, userTheme.data?.colors, setTheme]);
};
