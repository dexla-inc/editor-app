export const initializeFonts = async (
  defaultFontFamily: string | undefined,
  headingsFontFamily: string | undefined,
) => {
  if (typeof window !== "undefined") {
    console.log(defaultFontFamily, headingsFontFamily);
    const fallbackFont = "Open Sans";
    const WebFont = (await import("webfontloader")).default;
    WebFont.load({
      google: {
        families: [
          defaultFontFamily ?? fallbackFont,
          headingsFontFamily ?? fallbackFont,
        ],
      },
    });
  }
};
