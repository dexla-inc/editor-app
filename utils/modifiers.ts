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
  | "title"
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
  | "switch"
  | "accordion"
  | "avatar";

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
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "1.5",
    letterSpacing: "0px",
    textAlign: "left",
    color: "Text.0",
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
    borderRadius: "0px",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
    showBorder: "all",
    showRadius: "radius-all",
    borderStyle: "none",
    borderWidth: "0px",
    borderColor: "Border.6",
  },
  layout: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    rowGap: "20px",
    columnGap: "20px",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  position: {
    position: "relative",
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto",
    zIndex: 0,
  },
  background: {
    bg: "transparent",
    backgroundImage: "",
  },
  input: {
    size: "sm",
    placeholder: "Input",
    type: "text",
    label: "",
    icon: { props: { name: "" } },
    withAsterisk: false,
    labelSpacing: "0",
    name: "Input",
  },
  button: {
    value: "New Button",
    type: "button",
    variant: "filled",
    size: "md",
    color: "Primary.6",
    textColor: "White.0",
    leftIcon: "",
    justify: "center",
  },
  title: {
    value: "",
    color: "Black.6",
    order: "1",
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
    color: "teal",
  },
  icon: {
    color: "Primary.6",
    icon: "",
  },
  divider: {
    color: "Neutral.9",
    label: "Divider",
    labelPosition: "center",
    orientation: "horizontal",
    size: "md",
    variant: "solid",
  },
  select: {
    name: "Select",
    size: "sm",
    placeholder: "Select",
    type: "text",
    label: "A label",
    icon: "",
    withAsterisk: false,
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
  },
  effects: {
    cursor: "auto",
    overflow: "auto",
    opacity: 1,
    tooltip: "",
  },
  modal: {
    title: "Modal Title",
    forceHide: false,
  },
  boxShadow: {
    inset: "",
    xOffset: "0px",
    yOffset: "0px",
    blur: "0px",
    spread: "0px",
    color: "Black.9",
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
    data: "",
    headers: {},
    config: {},
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
      mapTypeId: "SATELITE",
      styles: [],
    },
    zoom: 10,
    markers: [],
  },
  fileButton: {
    name: "Upload Button",
    accept: "",
    multiple: false,
    disabled: false,
  },
  popOver: {
    title: "PopOver Title",
    position: "left",
  },
  navLink: {
    label: "Nav link",
    color: "transparent",
    align: "left",
    icon: "",
  },
  accordionItem: {
    value: "first",
  },
  switch: {
    label: "first",
    showLabel: true,
  },
  accordion: { variant: "default" },
  avatar: {
    variant: "filled",
    src: "",
    radius: "",
    size: "",
    color: "Primary.6",
    value: "",
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
