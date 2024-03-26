export const initializeFonts = async () => {
  if (typeof window !== "undefined") {
    // Dynamically import the webfontloader module
    const WebFont = (await import("webfontloader")).default;
    WebFont.load({
      google: {
        families: ["Open Sans", "Other Font Families Here"],
      },
    });
  }
};
