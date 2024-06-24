export const initializeFonts = async (
  defaultFontFamily: string | undefined,
  headingsFontFamily: string | undefined,
) => {
  const fallbackFont = "Open Sans";
  const WebFont = (await import("webfontloader")).default;
  WebFont.load({
    google: {
      families: [
        `${defaultFontFamily}:${supportedVariants.join()}` ?? fallbackFont,
        `${headingsFontFamily}:${supportedVariants.join()}` ?? fallbackFont,
      ],
    },
    context: frames[0],
  });
  // if (typeof window !== "undefined") {
  // }
};

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
