import { MantineThemeExtended } from "@/stores/editor";
import {
  CSSObject,
  DEFAULT_THEME,
  MantineSize,
  MantineTheme,
} from "@mantine/core";

// Global styles for the editor
const globalStyles = {
  body: {
    background: "#f8f9fa",
    backgroundImage: `radial-gradient(#ced4da 1px, transparent 1px), radial-gradient( #ced4da 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 50px 50px",
  },
  sizing: {
    icon: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
    } as Record<MantineSize, any>,
  },
};

// Default scrollbar style for the editor
const scrollbarStyles = {
  overflowX: "hidden",
  overflowY: "scroll",
  scrollbarWidth: "thin",
  scrollbarColor: "transparent transparent",
  msOverflowStyle: "-ms-autohiding-scrollbar",
  "::-webkit-scrollbar": { width: "5px", borderRadius: "10px" },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "transparent",
    borderRadius: "10px",
  },
  ":hover": { scrollbarColor: "#aaa transparent" },
  ":hover::-webkit-scrollbar-thumb": { backgroundColor: "#aaa" },
} as CSSObject;

// Nestable styles for the page structure items
const nestable = {
  ".nestable": { padding: 0, margin: 0 },
  ".nestable > ol": { padding: 0, margin: 0 },
  "ol,ul": { listStyleType: "none", margin: 0, padding: 0 },
  ".nestable-list": { paddingLeft: 10 },
  ".nestable-item-name > div": { paddingLeft: 0 },
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
      styles: (theme) => ({
        input: { borderColor: theme.colors.gray[3] },
      }),
    },
    Select: {
      styles: (theme) => ({
        input: { borderColor: theme.colors.gray[3] },
      }),
    },
    Card: {
      defaultProps: (theme) => ({
        style: { borderColor: theme.colors.gray[3] },
      }),
    },
  },
};

// Default Theme
const defaultTheme: MantineThemeExtended = {
  ...DEFAULT_THEME,
  fontFamily: "Arial, sans-serif",
  headings: {
    ...DEFAULT_THEME.headings,
    fontFamily: "Arial, sans-serif",
  },
  primaryColor: "teal",
  defaultFont: "Arial, sans-serif",
  hasCompactButtons: true,
  //focusRing: "DEFAULT",  Need to do focusRingStyles: {     styles(theme: MantineThemeBase): CSSObject;
  loader: "oval",
  cardStyle: "OUTLINED_ROUNDED",
  defaultSpacing: "md",
  defaultRadius: "md",
  theme: "LIGHT",
};

// Variables
const PRIMARY_COLOR = "#2F65CBff";
const GREEN_COLOR = theme.colors.teal[6];
const GRAY_COLOR = theme.colors.gray[5];
const ORANGE_BORDER_COLOR = "orange";
const GREEN_BORDER_COLOR = "teal";
const THIN_ORANGE_BASE_SHADOW = `0 0 0 1px ${theme.colors.orange[4]}`;
const ORANGE_BASE_SHADOW = `0 0 0 2px ${theme.colors.orange[6]}`;
const THIN_GREEN_BASE_SHADOW = `0 0 0 1px ${theme.colors.teal[4]}`;
const GREEN_BASE_SHADOW = `0 0 0 2px ${theme.colors.teal[6]}`;
const GRAY_OUTLINE = `2px dashed ${theme.colors.gray[3]}`;
const SELECTED = `1px solid ${GREEN_COLOR}`;
const HOVERED = theme.colors.gray[1];

// Default flex
const flexStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
};

// dark theme
const darkTheme = {
  ...defaultTheme,
  colorScheme: "dark",
  globalStyles: {
    body: { ...globalStyles, background: "#222" },
  },
};

type HoverProps = {
  paddings: {
    padding: string;
    paddingTop: string;
    paddingBottom: string;
    paddingLeft: string;
    paddingRight: string;
  };
  margins: {
    margin: string;
    marginTop: string;
    marginBottom: string;
    marginLeft: string;
    marginRight: string;
  };
};

// Dev hover style
const hoverStyles = (styles: any) => ({
  "&::before": {
    content: '""',
    ...styles.position,
    top: 0,
    left: 0,
    display: styles.display,
    position: "absolute",
    border: `${styles.padding.padding} solid rgba(153, 115, 0,0.1)`,
    boxSizing: "border-box",
    backgroundColor:
      "rgba(173, 216, 230, 0.5)" /* Light blue background for content */,
    pointerEvents: "none", // Ensure the pseudo-element doesn't block your element events
  },
  // "&::after": {
  //   content: '""',
  //   ...styles.position,
  //   display: styles.display,
  //   ...styles.padding,
  //   top: 0,
  //   left: 0,
  //   position: "absolute",
  //   // top: "-10px", // Adjust padding thickness here
  //   // right: "-10px", // Adjust padding thickness here
  //   // bottom: "-10px", // Adjust padding thickness here
  //   // left: "-10px", // Adjust padding thickness here
  //   // boxShadow:
  //   //   "0 0 0 10px rgba(0,255,0,0.3)" /* Adjust the overall width highlight */,
  //   pointerEvents: "none", // Ensure the pseudo-element doesn't block your element events
  // },

  // "&>*": {
  //   position: "relative",
  //   zIndex: 1 /* Make sure the content appears above the pseudo-elements */,
  //   backgroundColor:
  //     "rgba(173, 216, 230, 0.5)" /* Light blue background for content */,
  // },
});

export {
  GRAY_COLOR,
  GRAY_OUTLINE,
  GREEN_BASE_SHADOW,
  GREEN_BORDER_COLOR,
  GREEN_COLOR,
  HOVERED,
  ORANGE_BASE_SHADOW,
  ORANGE_BORDER_COLOR,
  PRIMARY_COLOR,
  SELECTED,
  THIN_GREEN_BASE_SHADOW,
  THIN_ORANGE_BASE_SHADOW,
  darkTheme,
  defaultTheme,
  flexStyles,
  globalStyles,
  hoverStyles,
  nestable,
  scrollbarStyles,
  theme,
};
