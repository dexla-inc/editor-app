// utils/webfontloader.ts
export const initializeFonts = async (
  defaultFontFamily: string | undefined,
  headingsFontFamily: string | undefined,
): Promise<void> => {
  if (typeof window !== "undefined") {
    const WebFont = (await import("webfontloader")).default;

    const loadFonts = (families: string[]) =>
      new Promise<void>((resolve, reject) => {
        WebFont.load({
          google: {
            families,
          },
          context: frames[0],
          active: resolve,
          inactive: reject,
        });
      });

    const supportedVariants = [
      "100",
      "100italic",
      "200",
      "200italic",
      "300",
      "300italic",
      "400",
      "400italic",
      "500",
      "500italic",
      "600",
      "600italic",
      "700",
      "700italic",
      "800",
      "800italic",
      "900",
      "900italic",
    ];

    const expectedFonts = [
      `${defaultFontFamily}:${supportedVariants.join()}`,
      `${headingsFontFamily}:${supportedVariants.join()}`,
    ].filter(Boolean);

    const fallbackFont = "Open Sans";
    const fallbackFonts = [`${fallbackFont}:${supportedVariants.join()}`];

    try {
      await loadFonts(expectedFonts);
    } catch {
      await loadFonts(fallbackFonts);
    }
  }
};
