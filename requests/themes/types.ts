import { CardStyle, FocusRing, LoaderType } from "@/requests/projects/types";
import { MantineSize } from "@mantine/core";

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
  defaultRadius: MantineSize;
  defaultSpacing: MantineSize;
  inputSize: MantineSize;
  defaultFont?: string;
  hasCompactButtons?: boolean;
  focusRing?: FocusRing;
  loader?: LoaderType;
  cardStyle?: CardStyle;
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

export type Font = {
  fontFamily: string;
  tag: string;
  fontWeight: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  type?: "TEXT" | "TITLE";
};

export type ResponsiveBreakpoint = {
  type: string;
  breakpoint: string;
};
