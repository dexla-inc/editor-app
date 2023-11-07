export type BrandingAITheme = {
  fontFamily: string;
  colors: {
    primary: {
      backgroundColor: string;
      textColor: string;
    };
    secondary: {
      backgroundColor: string;
      textColor: string;
    };
    tertiary: {
      backgroundColor: string;
      textColor: string;
    };
  };
  hasCompactButtons: boolean;
  focusRing: "DEFAULT" | "ON_BRAND_THIN" | "ON_BRAND_THICK";
  backgroundColor: string;
  cardStyle:
    | "ROUNDED"
    | "SQUARED"
    | "FLAT"
    | "ELEVATED"
    | "FLAT_ROUNDED"
    | "FLAT_SQUARED"
    | "OUTLINED"
    | "OUTLINED_ROUNDED"
    | "OUTLINED_SQUARED"
    | "ELEVATED_ROUNDED"
    | "ELEVATED_SQUARED"
    | "ELEVATED_OUTLINED"
    | "ELEVATED_OUTLINED_ROUNDED"
    | "ELEVATED_OUTLINED_SQUARED";
};
