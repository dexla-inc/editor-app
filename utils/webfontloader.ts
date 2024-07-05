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

export const initializeFonts = async (
  defaultFontFamily: string | undefined,
  headingsFontFamily: string | undefined,
) => {
  if (typeof window !== "undefined") {
    const fallbackFont = "Open Sans";
    const WebFont = (await import("webfontloader")).default;

    const defaultFont = defaultFontFamily
      ? `${defaultFontFamily}:${supportedVariants.join()}`
      : fallbackFont;
    const headingsFont = headingsFontFamily
      ? `${headingsFontFamily}:${supportedVariants.join()}`
      : fallbackFont;

    WebFont.load({
      google: {
        families: [defaultFont, headingsFont],
      },
      context: frames[0],
      active() {
        console.log("Fonts have loaded");
      },
      inactive() {
        console.error("Failed to load fonts");
      },
    });
  }
};
