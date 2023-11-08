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
  focusRing: FocusRing;
  backgroundColor: string;
  cardStyle: CardStyle;
  loader: LoaderType;
};

export type CardStyle =
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

export type FocusRing = "DEFAULT" | "ON_BRAND_THIN" | "ON_BRAND_THICK";
export type LoaderType = "OVAL" | "BARS" | "DOTS";
