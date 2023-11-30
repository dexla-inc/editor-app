import { TileResponse } from "@/requests/tiles/types";

export type TemplateParams = {
  id: string;
  name: string;
  state: string;
  prompt: string;
  type: TemplateTypes;
  tags?: string; // csv
};

export type TemplateResponse = TemplateParams & {
  tags?: TemplateTag[];
  tiles?: TileResponse[];
};

export type TemplateDetail = {
  name: string;
  type: TemplateTypes;
  tags?: TemplateTag[] | undefined;
};

export type TemplateTypes =
  | "DETAILS"
  | "REPORT"
  | "SEARCH"
  | "CHECKOUT"
  | "CHARTS"
  | "ERROR"
  | "FAQ"
  | "FEED"
  | "FORM"
  | "GALLERY"
  | "HELP"
  | "LANDING"
  | "LISTING"
  | "LOGIN"
  | "PROJECT"
  | "PROFILE"
  | "SELECTION"
  | "SETTINGS"
  | "WIZARD";

export const TemplateTypesKeys: Record<TemplateTypes, string> = {
  DETAILS: "Details",
  REPORT: "Report",
  SEARCH: "Search",
  CHECKOUT: "Checkout",
  CHARTS: "Charts",
  ERROR: "Error",
  FAQ: "FAQ",
  FEED: "Feed",
  FORM: "Form",
  GALLERY: "Gallery",
  HELP: "Help",
  LANDING: "Landing",
  LISTING: "Listing",
  LOGIN: "Login",
  PROJECT: "Project",
  PROFILE: "Profile",
  SELECTION: "Selection",
  SETTINGS: "Settings",
  WIZARD: "Wizard",
};

export type TemplateTag =
  | "FLAT"
  | "FUTURISTIC"
  | "MINIMALISTIC"
  | "MODERN"
  | "RETRO"
  | "TRADITIONAL"
  | "VINTAGE";

export const TemplateTypesOptions = Object.keys(TemplateTypesKeys).map(
  (key) => ({
    label: TemplateTypesKeys[key as TemplateTypes],
    value: key,
    group:
      key == "REPORT" || key == "SEARCH" || key == "DETAILS"
        ? "Popular"
        : "Others",
  }),
);
