import { CardStyle, FocusRing, LoaderType } from "@/requests/projects/types";

export type ThemeQueryParams = {
  websiteUrl?: string;
};

export type ThemeMutationParams = {
  colors: Color[];
  fonts: Font[];
  responsiveBreakpoints: ResponsiveBreakpoint[];
  faviconUrl: string;
  logoUrl: string;
  logos: Logo[];
  defaultRadius: string;
  defaultSpacing: string;
  defaultFont?: string;
  hasCompactButtons?: boolean;
  focusRing?: FocusRing;
  loader?: LoaderType;
  cardStyle: CardStyle;
  theme: "LIGHT" | "DARK";
};

export interface ThemeResponse extends ThemeMutationParams {
  id?: string;
  trackingId?: string;
  websiteUrl?: string;
}

export type Color = {
  name: string;
  friendlyName: string;
  hex: string;
  brightness: number;
  isDefault: boolean;
};

export type Logo = {
  url: string;
  type: "LIGHT" | "DARK";
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
