import { IDENTIFIER } from "@/utils/branding";

export type Modifiers =
  | "spacing"
  | "size"
  | "text"
  | "border"
  | "layout"
  | "position"
  | "background"
  | "input"
  | "button"
  | "image"
  | "link"
  | "icon"
  | "divider"
  | "select"
  | "effects"
  | "modal"
  | "boxShadow"
  | "checkbox"
  | "checkboxGroup"
  | "table"
  | "radio"
  | "drawer"
  | "buttonIcon"
  | "mapSettings"
  | "fileButton"
  | "popOver"
  | "navLink"
  | "accordionItem"
  | "accordion"
  | "avatar"
  | "textarea"
  | "breadcrumb"
  | "tabs"
  | "tab"
  | "tabsPanel"
  | "tabsList"
  | "alert"
  | "badge"
  | "dateInput"
  | "chart"
  | "grid"
  | "gridColumn"
  | "navbar"
  | "progress"
  | "countdownButton"
  | "autocomplete";

type RequiredModifiers = {
  [K in Modifiers]: Record<string, any>;
};

export const requiredModifiers: RequiredModifiers = {
  spacing: {
    padding: "0px",
    margin: "0px",
    paddingTop: undefined,
    paddingBottom: undefined,
    paddingLeft: undefined,
    paddingRight: undefined,
    marginTop: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    marginRight: undefined,
  },
  size: {
    width: "",
    height: "",
    minWidth: "",
    minHeight: "",
    maxWidth: "",
    maxHeight: "",
  },
  text: {
    style: {
      width: "fit-content",
      height: "fit-content",
      letterSpacing: "0px",
      wordSpacing: "0px",
      whiteSpace: "normal",
      fontWeight: 500,
      textShadow: "0px 0px 0px transparent",
    },
    fontTag: "P",
    order: 1,
    truncate: false,
    tt: "none",
    align: "left",
    td: "none",
    hideIfDataIsEmpty: false,
  },
  border: {
    borderTopStyle: "none",
    borderRightStyle: "none",
    borderBottomStyle: "none",
    borderLeftStyle: "none",
    borderTopWidth: "0px",
    borderRightWidth: "0px",
    borderBottomWidth: "0px",
    borderLeftWidth: "0px",
    borderTopColor: "Border.6",
    borderRightColor: "Border.6",
    borderBottomColor: "Border.6",
    borderLeftColor: "Border.6",
    borderColor: "Border.6",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
    borderStyle: "none",
    borderRadius: "0px",
    borderWidth: "0px",
  },
  layout: {
    gap: "xs",
    style: {
      display: "flex",
      flexWrap: "nowrap",
      flexDirection: "row",
      alignItems: "stretch",
      justifyContent: "flex-start",
      position: "relative",
      ...IDENTIFIER,
    },
  },
  position: {
    position: "relative",
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto",
    zIndex: 0,
    alignSelf: "center",
  },
  background: {
    bg: "transparent",
    bgGradient: `linear-gradient(90deg, #000000ff 0%, #FFFFFFff 100%)`,
    backgroundImage: "",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "0%",
    backgroundPositionY: "0%",
    backgroundAttachment: "scroll",
  },
  input: {
    showBorder: "all",
    placeholder: "Input",
    type: "text",
    label: "",
    icon: { props: { name: "" } },
    withAsterisk: false,
    clearable: false,
    labelSpacing: "0",
    passwordRange: [8, 20],
    passwordNumber: true,
    passwordLower: true,
    passwordUpper: true,
    bg: "White.6",
    pattern: "all",
  },
  textarea: {
    placeholder: "Textarea",
    label: "",
    labelSpacing: "0",
    hideIfDataIsEmpty: false,
    withAsterisk: false,
    autosize: false,
    style: {
      height: "fit-content",
    },
    bg: "White.6",
  },
  button: {
    type: "button",
    variant: "filled",
    icon: "",
    children: "Button",
    style: {
      width: "fit-content",
      paddingLeft: "32px",
      paddingRight: "32px",
    },
  },
  countdownButton: {
    variant: "filled",
    icon: "",
    style: {
      width: "fit-content",
      paddingLeft: "32px",
      paddingRight: "32px",
    },
    duration: "60seconds",
  },
  image: {
    fit: "contain",
    position: "relative",
  },
  link: {
    color: "Primary.6",
    style: {
      width: "fit-content",
      height: "fit-content",
      fontWeight: 500,
      letterSpacing: "0px",
    },
    fontTag: "P",
  },
  icon: {
    size: "md",
    name: "IconArrowNarrowRight",
    color: "Primary.6",
    bg: "transparent",
  },
  divider: {
    color: "Neutral.6",
    label: "Divider",
    labelPosition: "center",
    orientation: "horizontal",
    size: "xs",
    variant: "solid",
  },
  select: {
    placeholder: "Select",
    type: "text",
    label: "A label",
    icon: "",
    dropdownPosition: "flip",
    withAsterisk: false,
    clearable: false,
    searchable: false,
    dataType: "static",
    data: [
      { label: "Option 1", value: "option-1" },
      { label: "Option 2", value: "option-2" },
    ],
    customText: "",
    customLinkText: "",
    customLinkType: "page",
    customLinkUrl: "",
    style: {
      width: "100%",
    },
    bg: "White.6",
    maxDropdownHeight: "150px",
  },
  autocomplete: {
    placeholder: "Autocomplete",
    label: "A label",
    iconName: "",
    dropdownPosition: "flip",
    customText: "",
    customLinkText: "",
    customLinkType: "page",
    customLinkUrl: "",
    style: {
      width: "100%",
    },
    bg: "White.6",
  },
  effects: {
    cursor: "auto",
    overflow: "auto",
    opacity: 1,
    tooltip: "",
    tooltipColor: "Black.6",
    tooltipPosition: "top",
    skeletonMinWidth: "100%",
    skeletonMinHeight: 400,
  },
  modal: {
    showInEditor: true,
    size: "md",
    style: {
      padding: "16px", // Evalio specific, need to add modal styling in branding to configure each size
      display: "block",
    },
    title: "Heading",
    titleTag: "H4",
    withCloseButton: true,
  },
  boxShadow: {
    inset: "",
    xOffset: "0px",
    yOffset: "0px",
    blur: "0px",
    spread: "0px",
    color: "Black.9",
    boxShadow: "",
  },
  checkbox: {
    label: "A label",
    checked: false,
    withAsterisk: false,
    labelSpacing: "0",
    size: "sm",
  },
  checkboxGroup: {
    label: "A label",
    withAsterisk: false,
    labelSpacing: "0",
    workLikeRadio: false,
    size: "sm",
  },
  table: {
    dataType: "dynamic",
    highlightOnHover: true,
    horizontalCellSpacing: "sm",
    verticalCellSpacing: "sm",
    striped: false,
    withBorder: false,
    withColumnBorder: false,
    style: { width: "100%", overflowX: "scroll" },
  },
  radio: {
    label: "",
    weight: "normal",
    align: "left",
    withAsterisk: false,
    value: "",
  },
  drawer: {
    position: "left",
    size: "md",
    showInEditor: true,
    title: "Heading",
    titleTag: "H4",
    withCloseButton: true,
  },
  buttonIcon: {
    style: {
      width: "fit-content",
      height: "fit-content",
    },
  },
  mapSettings: {
    language: "en",
    options: {
      mapTypeId: "ROADMAP",
      mapTypeControl: true,
      styles: [
        {
          featureType: "all",
          elementType: "all",
          stylers: [{ saturation: 0, lightness: 0, gamma: 1 }],
        },
      ],
    },
    fade: false,
  },
  fileButton: {
    accept: "",
    multiple: false,
    compact: true,
    style: {
      width: "fit-content",
      paddingLeft: "32px",
      paddingRight: "32px",
    },
  },
  popOver: {
    position: "bottom",
    style: {
      padding: "10px",
      width: "fit-content",
      maxWidth: "fit-content",
    },
  },
  navLink: {
    color: "Black.6",
    iconColor: "Black.6",
    textAlign: "left",
    width: "100%",
    height: "auto",
    padding: "10px",
  },
  accordionItem: {
    value: "first",
  },
  accordion: {
    variant: "default",
    numberOfItems: 2,
  },
  avatar: {
    variant: "filled",
    src: "",
    radius: "",
    color: "Primary.6",
    value: "",
  },
  breadcrumb: {
    separator: "/",
  },
  tabs: {
    defaultValue: "first",
    variant: "default",
    orientation: "horizontal",
    radius: "sm",
    color: "Primary.6",
  },
  tab: {
    value: "first",
    icon: null,
    iconColor: "Primary.6",
  },
  tabsPanel: { value: "first" },
  tabsList: {
    position: "left",
    style: {
      flexWrap: "wrap",
    },
  },
  alert: {
    title: "Alert",
    color: "Danger.6",
  },
  badge: {
    color: "PrimaryText.6",
    bg: "Primary.6",
    size: "md",
    radius: "xl",
  },
  dateInput: {
    label: "",
    placeholder: "DD MMM YYYY",
    valueFormat: "DD MMM YYYY",
    description: "",
    withAsterisk: false,
    clearable: false,
    icon: "",
    iconPosition: "left",
    color: "Neutral.6",
    bg: "White.6",
    placeholderColor: "Neutral.8",
  },
  chart: {
    chartColors: [
      "Primary.6",
      "Secondary.6",
      "Tertiary.6",
      "Success.6",
      "Warning.6",
      "Danger.6",
      "Background.6",
      "Black.6",
      "Primary.3",
    ],
    labelColor: "SecondaryText.5",
    foreColor: "Secondary.5",
  },
  grid: {
    m: 0,
    p: 0,
    gridDirection: "column",
    gap: "xs",
    style: {
      width: "100%",
      height: "auto",
      backgroundRepeat: "no-repeat",
    },
  },
  gridColumn: {
    gap: "xs",
    style: {
      alignSelf: "start",
      justifyContent: "stretch",
      padding: "8px",
      flexWrap: "wrap",
      height: "100%",
      gridAutoRows: "max-content",
      gridAutoFlow: "row",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      ...IDENTIFIER,
    },
  },
  navbar: {
    width: "260px",
    gridTemplateRows: "auto 1fr auto",
    height: "100vh",
    top: "0",
    position: "sticky",
  },
  progress: {
    color: "Primary.6",
    size: "xs",
    animate: true,
  },
};

type AISupportedModifiers = {
  padding: string;
  margin: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  width: string;
  height: string;
  minWidth: string;
  minHeight: string;
  maxWidth: string;
  maxHeight: string;
  fontFamily: string;
  fontStyle: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
  color: string;
  borderTopStyle: string;
  borderRightStyle: string;
  borderBottomStyle: string;
  borderLeftStyle: string;
  borderTopWidth: string;
  borderRightWidth: string;
  borderBottomWidth: string;
  borderLeftWidth: string;
  borderTopColor: string;
  borderRightColor: string;
  borderBottomColor: string;
  borderLeftColor: string;
  borderRadius: string;
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;
  showBorder: string;
  showRadius: string;
  borderStyle: string;
  borderWidth: string;
  borderColor: string;
  display: string;
  flexWrap: string;
  flexDirection: string;
  rowGap: string;
  columnGap: string;
  alignItems: string;
  justifyContent: string;
  position: string;
  top: string;
  right: string;
  bottom: string;
  left: string;
  zIndex: number;
  background: string;
  backgroundColor: string;
  backgroundImage: string;
  placeholder: string;
  label: string;
  src: string;
  alt: string;
  fit: string;
  imagePosition: string;
  cursor: string;
  overflow: string;
  opacity: number;
  inset: string;
  xOffset: string;
  yOffset: string;
  blur: string;
  spread: string;
  boxShadowColor: string;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
};

const keysOfAISupportedModifiers: (keyof AISupportedModifiers)[] = [
  "padding",
  "margin",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "fontFamily",
  "fontStyle",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  "color",
  "borderTopStyle",
  "borderRightStyle",
  "borderBottomStyle",
  "borderLeftStyle",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "showBorder",
  "showRadius",
  "borderStyle",
  "borderWidth",
  "borderColor",
  "display",
  "flexWrap",
  "flexDirection",
  "rowGap",
  "columnGap",
  "alignItems",
  "justifyContent",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "zIndex",
  "background",
  "backgroundColor",
  "backgroundImage",
  "placeholder",
  "label",
  "src",
  "alt",
  "fit",
  "imagePosition",
  "cursor",
  "overflow",
  "opacity",
  "inset",
  "xOffset",
  "yOffset",
  "blur",
  "spread",
  "boxShadowColor",
];

export function isKeyOfAISupportedModifiers(
  key: string,
): key is keyof AISupportedModifiers {
  return keysOfAISupportedModifiers.includes(key as keyof AISupportedModifiers);
}
