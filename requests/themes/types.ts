export type ThemeQueryParams = {
  websiteUrl?: string;
};

export type ThemeMutationParams = {
  colors: Color[];
  fonts: Font[];
  responsiveBreakpoints: ResponsiveBreakpoint[];
  faviconUrl: string;
  logoUrl: string;
  defaultBorderRadius: number;
  defaultSpacing: number;
};

export interface ThemeResponse extends ThemeMutationParams {
  id: string;
  trackingId: string;
}

type Color = {
  name: string;
  friendlyName: string;
  hex: string;
  brightness: number;
  isDefault: boolean;
};

type Font = {
  fontFamily: string;
  tag: string;
  fontWeight: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

type ResponsiveBreakpoint = {
  type: string;
  breakpoint: string;
};
