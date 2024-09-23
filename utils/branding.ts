import { ExtendedUserTheme } from "@/requests/themes/types";
import { useUserConfigStore } from "@/stores/userConfig";
import { MantineThemeExtended } from "@/types/types";
import { splitValueAndUnit } from "@/utils/splitValueAndUnit";
import {
  CSSObject,
  DEFAULT_THEME,
  MantineSize,
  MantineTheme,
} from "@mantine/core";
import { omit } from "next/dist/shared/lib/router/utils/omit";

export const isDarkTheme = useUserConfigStore.getState().isDarkTheme;

// Nestable styles for the page structure items
const nestable = {
  ".nestable": { padding: 0, margin: 0 },
  ".nestable > ol": { padding: 0, margin: 0 },
  "ol,ul": { listStyleType: "none", margin: 0, padding: 0 },
  ".nestable-list": { paddingLeft: 10 },
  ".nestable-item-name > div": { paddingLeft: 0 },
};

const defaultComponentProps = {
  Avatar: {
    defaultProps: () => ({ size: "sm" }),
  },
  Checkbox: {
    defaultProps: () => ({ size: "xs" }),
  },
  Switch: {
    defaultProps: () => ({ size: "xs" }),
  },
  Button: {
    defaultProps: () => ({ size: "sm", compact: true }),
  },
  SegmentedControl: {
    defaultProps: () => ({ size: "xs" }),
  },
  Stack: {
    defaultProps: () => ({ spacing: "xs" }),
  },
  NumberInput: {
    defaultProps: () => ({ size: "xs" }),
  },
};

// App Theme
const theme: MantineTheme = {
  ...DEFAULT_THEME,
  fontFamily: "var(--font-inter)",
  headings: {
    ...DEFAULT_THEME.headings,
    fontFamily: "var(--font-inter)",
  },
  breakpoints: { xs: "500", sm: "1100", md: "1150", lg: "1200", xl: "1400" },
  black: "#222",
  primaryColor: "teal",
  components: {
    Input: {
      styles: () => ({
        input: { borderColor: GRAY_BORDER_COLOR },
      }),
      defaultProps: () => ({ size: "xs" }),
    },
    TextInput: {
      styles: () => ({
        input: { borderColor: GRAY_BORDER_COLOR },
      }),
      defaultProps: () => ({ size: "xs" }),
    },
    Select: {
      styles: () => ({
        input: { borderColor: GRAY_BORDER_COLOR },
      }),
      defaultProps: () => ({ size: "xs" }),
    },
    Card: {
      defaultProps: () => ({
        style: { borderColor: GRAY_BORDER_COLOR },
      }),
    },
    ColorSwatch: {
      styles: (theme) => ({
        root: { border: "1px solid " + theme.colors.gray[4] },
      }),
    },
    Tooltip: {
      defaultProps: () => ({
        fz: "xs",
        withArrow: true,
      }),
    },
    ...defaultComponentProps,
  },
};

// App dark theme
const darkTheme: MantineTheme = {
  ...theme,
  colorScheme: "dark",
  components: {
    Input: {
      styles: (theme) => ({
        input: {
          borderColor: theme.colors.dark[5],
        },
      }),
      defaultProps: () => ({ size: "xs" }),
    },
    TextInput: {
      styles: (theme) => ({
        input: {
          borderColor: theme.colors.dark[5],
        },
      }),
      defaultProps: () => ({ size: "xs" }),
    },
    Select: {
      styles: (theme) => ({
        input: { borderColor: theme.colors.dark[5] },
      }),
      defaultProps: () => ({ size: "xs" }),
    },
    Tooltip: {
      styles: (theme) => ({
        tooltip: { background: theme.colors.dark[4], color: theme.white },
      }),
      defaultProps: () => ({
        fz: "xs",
        withArrow: true,
      }),
    },
    Card: {
      defaultProps: (theme) => ({
        style: { borderColor: theme.colors.dark[5] },
      }),
    },
    ColorSwatch: {
      styles: (theme) => ({
        root: { border: "1px solid " + theme.colors.dark[5] },
      }),
    },
    Title: {
      defaultProps: () => ({ color: GRAY_WHITE_COLOR }),
    },
    Text: {
      defaultProps: () => ({ color: GRAY_WHITE_COLOR }),
    },
    ...defaultComponentProps,
  },
};

// Variables
const PRIMARY_COLOR = "#2F65CBff";
const GREEN_COLOR = theme.colors.teal[6];
const GRAY_COLOR = theme.colors.gray[5];
const GRAY_BORDER_COLOR = theme.colors.gray[3];
const GRAY_WHITE_COLOR = theme.colors.gray[0];
const ORANGE_BORDER_COLOR = "orange";
const GREEN_BORDER_COLOR = "teal";
const THIN_ORANGE_BASE_SHADOW = `0 0 0 1px ${theme.colors.orange[4]}`;
const ORANGE_COLOR = `${theme.colors.orange[6]}`;
const ORANGE_BASE_SHADOW = `0 0 0 2px ${ORANGE_COLOR}`;
const THIN_GREEN_BASE_SHADOW = `0 0 0 1px ${theme.colors.teal[4]}`;
const GREEN_BASE_SHADOW = `inset 0 0 0 2px ${theme.colors.teal[6]}`;
const GRAY_OUTLINE = `2px dashed ${GRAY_BORDER_COLOR}`;
const THIN_GRAY_OUTLINE = `1px solid ${GRAY_BORDER_COLOR}`;
const THIN_GREEN_OUTLINE = `1px solid ${theme.colors.teal[6]}`;
const THIN_DARK_OUTLINE = `1px solid ${theme.colors.dark[5]}`;
const SELECTED = `1px solid ${GREEN_COLOR}`;
const IDENTIFIER = {
  outline: GRAY_OUTLINE,
  outlineOffset: "-2px",
};
const HOVERED = theme.colors.gray[1];
const DARK_MODE = theme.colors.dark[7];
const DARK_COLOR = theme.colors.dark[6];
const LIGHT_MODE = "white";
const BG_COLOR = isDarkTheme ? DARK_MODE : LIGHT_MODE;
const TRANSPARENT_COLOR = isDarkTheme
  ? "rgba(255, 255, 255, 0.1)"
  : "rgba(0, 0, 0, 0.1)";
const LINK_COLOR = isDarkTheme ? "teal" : "white";
const FLEX_HOVER = isDarkTheme ? theme.colors.dark[4] : HOVERED;
const BORDER_COLOR = isDarkTheme ? theme.colors.dark[4] : theme.colors.gray[3];
const BUTTON_HOVER = isDarkTheme ? theme.colors.dark[6] : HOVERED;
const BORDER = isDarkTheme ? THIN_DARK_OUTLINE : THIN_GRAY_OUTLINE;
export const BG_RULES_CONDITION = isDarkTheme
  ? theme.colors.dark[4]
  : theme.colors.gray[4];
const BINDER_BACKGROUND = isDarkTheme
  ? theme.colors.dark[5]
  : theme.colors.gray[1];
const LOGICFLOW_BACKGROUND = isDarkTheme ? undefined : GRAY_WHITE_COLOR;
const DEFAULT_TEXTCOLOR = isDarkTheme ? "white" : DARK_COLOR;
const DISABLED_HOVER = { "&:hover": { backgroundColor: "none" } };

// Default scrollbar style for the editor
const scrollbarStyles = {
  overflow: "scroll",
  scrollbarWidth: "thin",
  scrollbarColor: "transparent transparent",
  msOverflowStyle: "-ms-autohiding-scrollbar",
  "::-webkit-scrollbar": { width: "5px", borderRadius: "10px", height: "5px" },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "transparent",
    borderRadius: "10px",
  },
  ":hover": { scrollbarColor: BG_COLOR + " transparent" },
  ":hover::-webkit-scrollbar-thumb": { backgroundColor: BG_COLOR },
} as CSSObject;

// Global styles for the editor
const globalStyles = (isDarkTheme?: boolean) => ({
  body: {
    background: isDarkTheme ? "#2C2E33" : "#f8f9fa",
    backgroundImage: `radial-gradient(${
      isDarkTheme ? theme.colors.dark[3] : "#ced4da"
    } 1px, transparent 1px), radial-gradient( ${
      isDarkTheme ? theme.colors.dark[3] : "#ced4da"
    } 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 50px 50px",
  },
  html: { colorScheme: "light" },
  sizing: {
    icon: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
    } as Record<MantineSize, any>,
  },
});

const defaultFontFamily = "Open Sans";

// Default Users Theme
const defaultUsersTheme: MantineThemeExtended = {
  ...DEFAULT_THEME,
  colors: {
    ...DEFAULT_THEME.colors,
    Primary: ["", "", "", "", "", "#2F65CB", "", "", "", ""],
    PrimaryText: ["", "", "", "", "", "#FFFFFF", "", "", "", ""],
    Secondary: ["", "", "", "", "", "#D9D9D9", "", "", "", ""],
    SecondaryText: ["", "", "", "", "", "#000000", "", "", "", ""],
    Tertiary: ["", "", "", "", "", "#E57F4F", "", "", "", ""],
    TertiaryText: ["", "", "", "", "", "#FFFFFF", "", "", "", ""],
    Background: ["", "", "", "", "", "#FF9600", "", "", "", ""],
    Danger: ["", "", "", "", "", "#FE191C", "", "", "", ""],
    Warning: ["", "", "", "", "", "#FFCC00", "", "", "", ""],
    Success: ["", "", "", "", "", "#10D48E", "", "", "", ""],
    Neutral: ["", "", "", "", "", "#F1F1F1", "", "", "", ""],
    Black: ["", "", "", "", "", "#000000", "", "", "", ""],
    White: ["", "", "", "", "", "#FFFFFF", "", "", "", ""],
    Border: ["", "", "", "", "", "#EEEEEE", "", "", "", ""],
  },
  fonts: [
    {
      fontFamily: defaultFontFamily,
      tag: "H1",
      fontWeight: "500",
      fontSize: 48,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    {
      fontFamily: defaultFontFamily,
      tag: "H2",
      fontWeight: "500",
      fontSize: 28,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    {
      fontFamily: defaultFontFamily,
      tag: "H3",
      fontWeight: "500",
      fontSize: 24,
      lineHeight: 1.67,
      letterSpacing: 0,
    },
    {
      fontFamily: defaultFontFamily,
      tag: "H4",
      fontWeight: "600",
      fontSize: 22,
      lineHeight: 1.45,
      letterSpacing: 0,
    },
    {
      fontFamily: defaultFontFamily,
      tag: "H5",
      fontWeight: "500",
      fontSize: 20,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    {
      fontFamily: defaultFontFamily,
      tag: "H6",
      fontWeight: "600",
      fontSize: 18,
      lineHeight: 1.33,
      letterSpacing: 0,
    },
    {
      fontFamily: defaultFontFamily,
      tag: "P",
      fontWeight: "400",
      fontSize: 14,
      lineHeight: 1.43,
      letterSpacing: 0,
    },
  ],
  fontFamily: defaultFontFamily,
  headings: {
    ...DEFAULT_THEME.headings,
    fontFamily: defaultFontFamily,
  },
  primaryColor: "teal",
  defaultFont: defaultFontFamily,
  hasCompactButtons: true,
  //focusRing: "DEFAULT",  Need to do focusRingStyles: {     styles(theme: MantineThemeBase): CSSObject;
  loader: "oval",
  cardStyle: "OUTLINED_ROUNDED",
  defaultSpacing: "sm",
  defaultRadius: "sm",
  inputSize: "sm",
  theme: "LIGHT",
};

// Default flex
const flexStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
};

// Dev hover style
const hoverStyles = (styles: any) => {
  const {
    position,
    padding: { padding, paddingTop, paddingBottom, paddingLeft, paddingRight },
    margin: { margin, marginTop, marginBottom, marginLeft, marginRight },
    display,
  } = styles;
  return {
    position: "relative",
    "&::before": {
      content: '""',
      ...position,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display,
      position: "absolute",
      border: `${padding} solid rgba(173, 216, 230, 0.5)`,
      borderTop: `${paddingTop} solid rgba(173, 216, 230, 0.5)`,
      borderBottom: `${paddingBottom} solid rgba(173, 216, 230, 0.5)`,
      borderLeft: `${paddingLeft} solid rgba(173, 216, 230, 0.5)`,
      borderRight: `${paddingRight} solid rgba(173, 216, 230, 0.5)`,
      boxSizing: "border-box",
      zIndex: 1,
      pointerEvents: "none", // Ensure the pseudo-element doesn't block your element events
    },
    "&::after": {
      content: '""',
      ...position,
      width: `calc(${position.width} + ${marginLeft ?? margin} + ${
        marginRight ?? margin
      })`,
      height: `calc(${position.height} + ${marginTop ?? margin} + ${
        marginBottom ?? margin
      })`,
      top: `-${marginTop ?? margin}`,
      left: `-${marginLeft ?? margin}`,
      bottom: `-${marginBottom ?? margin}`,
      right: `-${marginRight ?? margin}`,
      display,
      position: "absolute",
      border: `${margin} solid rgba(255, 165, 0, 0.3)`,
      borderTop: `${marginTop} solid rgba(255, 165, 0, 0.3)`,
      borderBottom: `${marginBottom} solid rgba(255, 165, 0, 0.3)`,
      borderLeft: `${marginLeft} solid rgba(255, 165, 0, 0.3)`,
      borderRight: `${marginRight} solid rgba(255, 165, 0, 0.3)`,
      boxSizing: "border-box",
      pointerEvents: "none", // Ensure the pseudo-element doesn't block your element events
    },
  };
};

export const getColorValue = (theme: MantineThemeExtended, value?: string) => {
  if (value === undefined || value === "transparent") return "transparent";
  const [color, index] = value?.split(".");

  const _value = index ? theme.colors[color]?.[Number(index)] : color;

  return _value;
};

const getHoverColor = (value: string) => {
  let [color, opacity] = value.split(".");
  const operator = color === "Black" ? -1 : 1;
  opacity = opacity ? `${parseInt(opacity) + operator}` : "";
  return `${color}.${opacity}`;
};

const isBorderWidthNotZero = (style: CSSObject) => {
  const borderTypes: Array<keyof CSSObject> = [
    "borderWidth",
    "borderTopWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderRightWidth",
  ];
  return borderTypes.some((borderType) => {
    const [size, _] = splitValueAndUnit(style[borderType] as string) || [
      0,
      "px",
    ];
    return size > 0;
  });
};

const isBorderStyleNotNone = (style: CSSObject) => {
  const borderTypes: Array<keyof CSSObject> = [
    "borderStyle",
    "borderTopStyle",
    "borderBottomStyle",
    "borderLeftStyle",
    "borderRightStyle",
  ];
  return borderTypes.some((borderType) => style[borderType] !== "none");
};

const componentHasBorder = (style: CSSObject = {}) => {
  return isBorderWidthNotZero(style) && isBorderStyleNotNone(style);
};

// Theme colors setup
function rgbaToHex(rgba: string) {
  // Regular expression to match RGB or RGBA strings
  const rgbaRegex =
    /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*(?:\.\d+)?))?\)$/;

  // Extract values from the RGBA string
  const match = rgba.match(rgbaRegex);

  if (!match) return rgba;

  const toHex = (x: string) => {
    const num = Math.round(parseFloat(x));
    return num.toString(16).padStart(2, "0");
  };

  // Convert RGB components
  const r = toHex(match[1]).toUpperCase();
  const g = toHex(match[2]).toUpperCase();
  const b = toHex(match[3]).toUpperCase();

  // If alpha is provided, convert it; otherwise, return the RGB hex
  if (match[4] !== undefined) {
    const a = toHex(
      Math.round(parseFloat(match[4]) * 255).toString(),
    ).toUpperCase();
    return `#${r}${g}${b}${a}`;
  }

  return `#${r}${g}${b}`;
}

const setHexColors = (hexaValue: string) => {
  const hex = hexaValue.substring(0, 7);
  return [
    rgbaToHex(defaultUsersTheme.fn.lighten(hex, 0.9)),
    rgbaToHex(defaultUsersTheme.fn.lighten(hex, 0.8)),
    rgbaToHex(defaultUsersTheme.fn.lighten(hex, 0.7)),
    rgbaToHex(defaultUsersTheme.fn.lighten(hex, 0.6)),
    rgbaToHex(defaultUsersTheme.fn.lighten(hex, 0.5)),
    hexaValue.startsWith("#000000")
      ? "#323232ff"
      : rgbaToHex(defaultUsersTheme.fn.lighten(hex, 0.4)), // Custom hover for black
    hexaValue,
    hexaValue.startsWith("#FFFFFF")
      ? "#F5F8F8ff"
      : rgbaToHex(defaultUsersTheme.fn.darken(hex, 0.1)), // Custom hover for white
    rgbaToHex(defaultUsersTheme.fn.darken(hex, 0.2)),
    rgbaToHex(defaultUsersTheme.fn.darken(hex, 0.3)),
  ];
};

const createUserThemeColors = (colors: ExtendedUserTheme["colors"]) => {
  return colors.reduce(
    (acc, color) => {
      const hexaValues = setHexColors(color.hex);
      const colorWithoutBrightness = omit(color, ["brightness"]);
      const data = Array(10)
        .fill(colorWithoutBrightness)
        .map(({ name, friendlyName, hex, isDefault }, index) => ({
          name: `${name}.${index}`,
          friendlyName: `${friendlyName}.${index}`,
          hex: hexaValues[index],
          isDefault,
        }));
      acc.push(...data);
      return acc;
    },
    [] as ExtendedUserTheme["colorShades"],
  );
};

const fetchUniqueColors = (
  userTheme?: Omit<ExtendedUserTheme, "colorFamilies">,
) => {
  const oldColors = createUserThemeColors(userTheme?.colors ?? []);
  const colorShades = userTheme?.colorShades ?? [];
  // Create a Map to store unique colors, prioritizing colorShades
  const uniqueColorsMap = new Map<
    string,
    ExtendedUserTheme["colorShades"][0]
  >();
  colorShades.forEach((color) => {
    uniqueColorsMap.set(color.name, color);
  });

  oldColors.forEach((color) => {
    if (!uniqueColorsMap.has(color.name)) {
      uniqueColorsMap.set(color.name, color);
    }
  });

  return Array.from(uniqueColorsMap.values());
};

const convertThemeColors = (
  userTheme?: Omit<ExtendedUserTheme, "colorFamilies">,
  useName?: boolean,
) => {
  // Convert the map values back to an array
  const uniqueColors = fetchUniqueColors(userTheme);
  const colorMap = new Map<string, ExtendedUserTheme["colorFamilies"][0]>();
  uniqueColors.forEach((color) => {
    const field = useName ? "name" : "friendlyName";
    const family = color[field].match(/^[a-zA-Z\s-_]+/)?.[0]?.trim() ?? "";
    if (!colorMap.has(family)) {
      colorMap.set(family, { family, colors: [] });
    }
    colorMap.get(family)!.colors.push(color);
  });
  return Array.from(colorMap.values());
};

const setFormColorShadesFromColorFamilies = (values: ExtendedUserTheme) => {
  const colorShades = values.colorFamilies.flatMap((family) => family.colors);
  return omit({ ...values, colorShades }, ["colorFamilies"]);
};

export {
  BG_COLOR,
  BINDER_BACKGROUND,
  BORDER,
  BORDER_COLOR,
  BUTTON_HOVER,
  componentHasBorder,
  convertThemeColors,
  createUserThemeColors,
  DARK_COLOR,
  DARK_MODE,
  darkTheme,
  DEFAULT_TEXTCOLOR,
  defaultUsersTheme as defaultTheme,
  DISABLED_HOVER,
  FLEX_HOVER,
  flexStyles,
  getHoverColor,
  globalStyles,
  GRAY_BORDER_COLOR,
  GRAY_COLOR,
  GRAY_OUTLINE,
  GRAY_WHITE_COLOR,
  GREEN_BASE_SHADOW,
  GREEN_BORDER_COLOR,
  GREEN_COLOR,
  HOVERED,
  hoverStyles,
  IDENTIFIER,
  LIGHT_MODE,
  LINK_COLOR,
  LOGICFLOW_BACKGROUND,
  nestable,
  ORANGE_BASE_SHADOW,
  ORANGE_BORDER_COLOR,
  ORANGE_COLOR,
  PRIMARY_COLOR,
  rgbaToHex,
  scrollbarStyles,
  SELECTED,
  setFormColorShadesFromColorFamilies,
  theme,
  THIN_DARK_OUTLINE,
  THIN_GRAY_OUTLINE,
  THIN_GREEN_BASE_SHADOW,
  THIN_GREEN_OUTLINE,
  THIN_ORANGE_BASE_SHADOW,
  TRANSPARENT_COLOR,
};
