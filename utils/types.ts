import { CardStyle } from "@/requests/projects/types";
import { Font, Logo, ResponsiveBreakpoint } from "@/requests/themes/types";
import { MantineSize, MantineTheme, Tuple } from "@mantine/core";

export type BindingType = "Formula" | "JavaScript";
export type BindingTab =
  | "components"
  | "variables"
  | "actions"
  | "auth"
  | "browser";

export type ValueProps = Partial<{
  dataType: "static" | "dynamic" | "boundCode";
  static: any;
  dynamic: string;
  boundCode: string;
}>;

// Copy the properties from ThemeMutationParams
export interface MantineThemeExtended extends MantineTheme {
  colors: ExtendedMantineThemeColors;
  fonts: Font[];
  defaultRadius: MantineSize;
  defaultSpacing: MantineSize;
  inputSize: MantineSize;
  defaultFont?: string;
  hasCompactButtons?: boolean;
  cardStyle?: CardStyle;
  theme: "LIGHT" | "DARK";
  responsiveBreakpoints?: ResponsiveBreakpoint[];
  faviconUrl?: string;
  logoUrl?: string;
  logos?: Logo[];
}

interface CustomColors {
  Primary: Tuple<string, 10>;
  PrimaryText: Tuple<string, 10>;
  Secondary: Tuple<string, 10>;
  SecondaryText: Tuple<string, 10>;
  Tertiary: Tuple<string, 10>;
  TertiaryText: Tuple<string, 10>;
  Background: Tuple<string, 10>;
  Danger: Tuple<string, 10>;
  Warning: Tuple<string, 10>;
  Success: Tuple<string, 10>;
  Neutral: Tuple<string, 10>;
  Black: Tuple<string, 10>;
  White: Tuple<string, 10>;
  Border: Tuple<string, 10>;
}

type ExtendedMantineThemeColors = CustomColors & MantineTheme["colors"];
