export type TemplateParams = {
  name: string;
  state: string;
  prompt: string;
  type: TemplateTypes;
  tags?: string; // csv
};

export type TemplateResponse = TemplateParams & {
  id: string;
  tags?: TemplateTag[];
};

export type TemplateTypes =
  | "LOGIN"
  | "FORM"
  | "SEARCH"
  | "SETTINGS"
  | "HELP"
  | "REPORT"
  | "ERROR"
  | "PROFILE"
  | "CHARTS"
  | "LISTING"
  | "DETAILS"
  | "GALLERY"
  | "FEED"
  | "WIZARD"
  | "LANDING"
  | "CHECKOUT"
  | "FAQ"
  | "PROJECT"
  | "SELECTION";

export const TemplateTypesKeys: Record<TemplateTypes, string> = {
  LOGIN: "Login",
  FORM: "Form",
  SEARCH: "Search",
  SETTINGS: "Settings",
  HELP: "Help",
  REPORT: "Report",
  ERROR: "Error",
  PROFILE: "Profile",
  CHARTS: "Charts",
  LISTING: "Listing",
  DETAILS: "Details",
  GALLERY: "Gallery",
  FEED: "Feed",
  WIZARD: "Wizard",
  LANDING: "Landing",
  CHECKOUT: "Checkout",
  FAQ: "FAQ",
  PROJECT: "Project",
  SELECTION: "Selection",
};

type TemplateTag =
  | "MODERN"
  | "TRADITIONAL"
  | "MINIMALISTIC"
  | "FLAT"
  | "FUTURISTIC"
  | "RETRO"
  | "VINTAGE";

export const TemplateTypesOptions = Object.keys(TemplateTypesKeys).map(
  (key) => ({
    label: TemplateTypesKeys[key as TemplateTypes],
    value: key,
  }),
);
