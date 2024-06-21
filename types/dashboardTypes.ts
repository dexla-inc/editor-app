import { DataSourceResponse } from "@/requests/datasources/types";
import { RegionTypes } from "@/requests/projects/types";
import { PatchParams } from "@/requests/types";
import { DexlaNotificationProps } from "@/stores/app";

export type NavbarTypes = "editor" | "company" | "project";

export type ToggleMenuItem = {
  id: string;
  icon: React.ReactNode;
  onClick: () => void;
  text: string;
};

export type NextStepperClickEvent = {
  nextStep: () => void;
};

export type NextStepperOptionalClickEvent = {
  nextStep?: () => void;
};

export type PreviousStepperClickEvent = {
  prevStep: () => void;
};

export type PreviousStepperOptionalClickEvent = {
  prevStep?: () => void;
};

export type LoadingStore = {
  isLoading: boolean;
  setIsLoading?: (isLoading: boolean) => void;
  startLoading: (state: DexlaNotificationProps) => void;
  stopLoading: (state: DexlaNotificationProps) => void;
};

export type StepperStepProps = {
  label: string;
  description: string;
};

export interface DexlaStepperProps extends StepperState {
  details: StepperStepProps[];
}

export type StepperState = {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export function isWebsite(value: string): boolean {
  // This regex checks for optional 'http://', 'https://', and 'www.', followed by
  // any non-space characters (which should be the domain name plus TLD), at least
  // one dot, and then more non-space characters (which should be the TLD).
  // It also enforces that the string does not contain spaces and ends with a TLD.
  const pattern =
    /^(?:(?:http:\/\/)|(?:https:\/\/))?(?:www\.)?[\w\-_]+(\.[\w\-_]+)+.*$/i;
  return pattern.test(value);
}

export function isSwaggerFile(url: string) {
  return url.endsWith("json") || url.endsWith("yaml");
}

type DataSourceSettingsProps = {
  dataSource: DataSourceResponse | undefined;
  setDataSource?: (dataSource: DataSourceResponse) => void;
};

export interface DataSourceStepperProps
  extends DataSourceSettingsProps,
    LoadingStore,
    NextStepperOptionalClickEvent,
    PreviousStepperOptionalClickEvent {}

export interface DataSourceStepperWithoutPreviousProps
  extends DataSourceSettingsProps,
    LoadingStore,
    NextStepperClickEvent {}

export interface DataSourceStepperWithoutNextProps
  extends DataSourceSettingsProps,
    LoadingStore,
    PreviousStepperClickEvent {}

export function areValuesEqual<T extends {}>(obj1: T, obj2: T): boolean {
  const properties = keysOf<T>(obj1);
  for (let prop of properties) {
    if (obj1[prop] !== obj2?.[prop]) {
      return false;
    }
  }
  return true;
}

export function keysOf<T extends {}>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

type QueryParams = {
  [key: string]: string | number | boolean | undefined;
};

export function toQueryString(params: Record<string, string>): string {
  const queryString = Object.keys(params)
    .filter((key) => params[key])
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
    )
    .join("&");

  return queryString ? `?${queryString}` : "";
}

export function buildQueryString(paramsObj: QueryParams): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(paramsObj)) {
    if (value !== undefined) {
      params.append(key, value.toString());
    }
  }

  let queryString = "";
  if (params.toString()) {
    queryString += `?${params.toString()}`;
  }

  return queryString;
}

export type ExtractRouteParams<TPath extends string> = {
  [K in Split<TPath, "/">[number] as K extends `[${infer P}]`
    ? P
    : never]: string;
};

export type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S];

export function replaceBrackets(
  basePath: string,
  replacements: Record<string, string> | undefined,
): string {
  const safeReplacements = replacements || {};
  return basePath.replace(/\[([^\]]+)\]/g, (_, placeholder) => {
    return safeReplacements[placeholder];
  });
}

export const fonts = [
  "Arial",
  "Helvetica",
  "Inter",
  "Inter, sans-serif",
  "Lato",
  "Open Sans",
  "Opensaucesans",
  "Poppins",
  "Roboto",
  "Raleway",
  "Red Hat Display",
  "sans-serif",
  "Segoe UI, sans-serif",
  "Times New Roman",
];

export const regionTypeLabels: { [key in RegionTypes]: string } = {
  UK_SOUTH: "United Kingdom",
  US_CENTRAL: "United States",
  FRANCE_CENTRAL: "European Union",
};

export const regionTypeFlags: Record<RegionTypes, string> = {
  UK_SOUTH: "/uk-flag.svg",
  US_CENTRAL: "/us-flag.svg",
  FRANCE_CENTRAL: "/eu-flag.svg",
};

export const regionTypes = (Object.keys(regionTypeLabels) as RegionTypes[]).map(
  (regionType) => ({
    value: regionType,
    label: regionTypeLabels[regionType],
    flag: regionTypeFlags[regionType],
  }),
);

export type AppTypes = "PAGE" | "TEMPLATE" | "PROJECT";

export type InputTypes =
  | "text"
  | "number"
  | "numberRange"
  | "password"
  | "email"
  | "url"
  | "tel"
  | "search";

export const INPUT_TYPES_DATA: { label: string; value: InputTypes }[] = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Number Range", value: "numberRange" },
  { label: "Email", value: "email" },
  { label: "Password", value: "password" },
  { label: "Telephone", value: "tel" },
  { label: "Url", value: "url" },
  { label: "Search", value: "search" },
];

export type UserRoles = "MEMBER" | "ADMIN" | "OWNER" | "GUEST" | "DEXLA_ADMIN";
export type TeamStatus = "PENDING" | "INVITED" | "ACCEPTED" | "REJECTED";

export function toSpaced(name: string | undefined) {
  if (!name) return "";
  return name.replace(/([A-Z])/g, " $1").trim();
}

export function snakeToSpacedText(text: string): string {
  return text
    .split("_") // Split the string by underscores
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)?.toLowerCase(), // Capitalize the first letter and make the rest lowercase
    )
    .join(" "); // Join the words with spaces
}

export function convertToPatchParams<T extends Record<string, any>>(
  obj: T,
): PatchParams[] {
  return Object.keys(obj).map((key) => ({
    op: "replace",
    path: `/${key}`,
    value: obj[key],
  }));
}

export type ApiType = "header" | "parameter" | "body";

export function generateId(): string {
  const guid = crypto.randomUUID();
  return guid.replace(/-/g, "");
}
