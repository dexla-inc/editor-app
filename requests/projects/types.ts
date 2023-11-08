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
  | "OUTLINED"
  | "ELEVATED"
  | "OUTLINED_ROUNDED"
  | "OUTLINED_SQUARED"
  | "OUTLINED_ELEVATED"
  | "ELEVATED_ROUNDED"
  | "ELEVATED_SQUARED"
  | "ELEVATED_OUTLINED_ROUNDED"
  | "ELEVATED_OUTLINED_SQUARED";

export type FocusRing = "DEFAULT" | "ON_BRAND_THIN" | "ON_BRAND_THICK";
export type LoaderType = "OVAL" | "BARS" | "DOTS";
