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
  | "table"
  | "radio"
  | "radioItem"
  | "stepper"
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
  | "progress";

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
    value: "New Text",
    size: "sm",
    weight: "normal",
    color: "Black.6",
    lineHeight: "",
    letterSpacing: "0px",
    wordSpacing: "0px",
    align: "left",
    hideIfDataIsEmpty: false,
    textDecoration: "none",
    textTransform: "none",
    textWrap: "normal",
    truncate: "false",
    textShadow: {
      xOffset: "0px",
      yOffset: "0px",
      blur: "0px",
      shadowColor: "transparent",
    },
    order: "1",
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
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row",
    gap: "xs",
    alignItems: "stretch",
    justifyContent: "flex-start",
    position: "relative",
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
    bgGradient:
      "linear-gradient(90deg, #ffffffff 0%, #000000ff 50%, #00ff00ff 100%)",
    backgroundImage: "",
    backgroundSize: "contain",
    backgroundRepeat: "repeat",
    backgroundPositionX: "0%",
    backgroundPositionY: "0%",
    backgroundAttachment: "scroll",
  },
  input: {
    size: "sm",
    placeholder: "Input",
    type: "text",
    label: "",
    icon: { props: { name: "" } },
    withAsterisk: false,
    clearable: false,
    labelSpacing: "0",
    name: "Input",
  },
  textarea: {
    size: "sm",
    placeholder: "Textarea",
    label: "",
    icon: { props: { name: "" } },
    withAsterisk: false,
    hideIfDataIsEmpty: false,
    autosize: false,
    labelSpacing: "0",
    name: "Textarea",
  },
  button: {
    value: "New Button",
    type: "button",
    variant: "filled",
    size: "sm",
    radius: "sm",
    leftIcon: "",
  },
  image: {
    src: "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png",
    alt: "",
    fit: "contain",
    position: "relative",
  },
  link: {
    value: "New Link",
    size: "md",
    color: "Primary.6",
  },
  icon: {
    size: "md",
    name: "IconArrowNarrowRight",
    color: "Primary.6",
    bg: "transparent",
  },
  divider: {
    color: "Neutral.9",
    label: "Divider",
    labelPosition: "center",
    orientation: "horizontal",
    size: "xs",
    variant: "solid",
  },
  select: {
    name: "Select",
    size: "sm",
    placeholder: "Select",
    type: "text",
    label: "A label",
    icon: "",
    dropdownPosition: "flip",
    withAsterisk: false,
    clearable: false,
    labelSize: "sm",
    labelWeight: "normal",
    labelAlign: "left",
    data: [
      { label: "Option 1", value: "option-1" },
      { label: "Option 2", value: "option-2" },
    ],
    exampleData: [
      { label: "Option 1", value: "option-1" },
      { label: "Option 2", value: "option-2" },
    ],
    customText: "",
    customLinkText: "",
    customLinkUrl: "",
  },
  effects: {
    cursor: "auto",
    overflow: "auto",
    opacity: 1,
    tooltip: "",
  },
  modal: {
    forceHide: false,
    size: "md",
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
    name: "Checkbox",
    label: "A label",
    checked: false,
    size: "sm",
    withAsterisk: false,
    labelSpacing: "0",
  },
  table: {
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
    size: "sm",
    weight: "normal",
    align: "left",
    withAsterisk: false,
  },
  radioItem: {
    value: "",
  },
  stepper: {
    activeStep: "0",
    numberOfSteps: 3,
    orientation: "horizontal",
    color: "Primary.6",
  },
  drawer: {
    title: "Drawer Title",
    position: "left",
  },
  buttonIcon: {
    bg: "transparent",
  },
  mapSettings: {
    language: "en",
    apiKey: "",
    center: {
      lat: 0.0,
      lng: 0.0,
    },
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
    zoom: 3,
    fade: false,
    markers: [],
  },
  fileButton: {
    name: "Upload Button",
    accept: "",
    multiple: false,
    disabled: false,
  },
  popOver: {
    position: "bottom",
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
  accordion: { variant: "default", numberOfItems: 2 },
  avatar: {
    variant: "filled",
    src: "",
    radius: "",
    size: "md",
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
  tabsList: { position: "left" },
  alert: {
    title: "Alert",
    color: "Danger.6",
  },
  badge: {
    value: "New Badge",
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
    radius: "sm",
    size: "sm",
    disabled: false,
    withAsterisk: false,
    clearable: false,
    icon: "",
    iconPosition: "left",
    labelSize: "sm",
  },
  chart: {
    data: "",
    dataLabels: "",
    colors: [
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
    gap: "xs",
  },
  gridColumn: {
    alignSelf: "start",
    justifyContent: "stretch",
    gap: "xs",
    padding: "8px",
  },
  navbar: {
    width: "260px",
    gridTemplateRows: "auto 1fr auto",
    height: "100vh",
    position: "sticky",
    top: "0",
  },
  progress: {
    color: "Primary.6",
    size: "xs",
    value: 50,
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
