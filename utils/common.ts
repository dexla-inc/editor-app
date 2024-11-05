import { PagingModel } from "@/requests/types";
import { FileWithPath } from "@mantine/dropzone";
import { GRID_SIZE } from "./config";
import { requiredModifiers } from "./modifiers";

export const convertToBase64 = (file: FileWithPath): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const toBase64 = (str: string | null | undefined): string => {
  if (!str) return "";
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str).toString("base64");
  }

  if (typeof btoa !== "undefined") {
    return btoa(str);
  }

  return "";
};

export const fromBase64 = (str: string | null | undefined): string => {
  if (!str) return "";
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64").toString("utf-8");
  }

  if (typeof atob !== "undefined") {
    return atob(str);
  }

  return "";
};

export function cleanJson(json: string | null) {
  return json?.replace("```json", "").replace("```", "");
}

export const AUTOCOMPLETE_OFF_PROPS = {
  autoComplete: "off",
  "data-lpignore": "true",
  "data-form-type": "other",
};

export const allEqual = <T>(array: T[]): boolean => {
  if (array.length === 0) return true;

  return array.every((element) => element === array[0]);
};

export type UrlType = "project" | "live" | "editor";

export function safeJsonParse(str: any) {
  if (typeof str !== "string") return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export function safeJsonStringify(str: any) {
  if (!str) return str;
  try {
    const canParse = JSON.parse(str);
    return canParse ? str : JSON.stringify(str, null, 2);
  } catch (e) {
    return JSON.stringify(str, null, 2);
  }
}

export function jsonInString(value: any) {
  return (
    typeof value === "string" &&
    (value.startsWith("{") || value.startsWith("["))
  );
}

export function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

export function isObjectOrArray(value: any): boolean {
  return isObject(value) || Array.isArray(value);
}

export type ObjectItem = {
  key: string;
  value: string;
  path: string;
  type: string;
  children?: ObjectItem[];
};

export const objToItems = (
  obj: any,
  root: any,
  prefix: string = "",
): ObjectItem[] => {
  if (!obj) return [];
  return Object.entries(obj).map(([key, value]) => {
    // if key is a number we want to wrap it with [], otherwise, prefix it with .
    const builtKey = isNaN(Number(key)) ? `.${key}` : `[${key}]`;
    // if prefix is empty, we want to remove that initial . because we are already prefixing it with `${entity}.`
    let path = prefix ? `${prefix}${builtKey}` : builtKey.replace(".", "");

    return {
      key,
      value: JSON.stringify(value),
      path,
      type: typeof value,
      children:
        value && typeof value === "object"
          ? objToItems(value, root, path)
          : undefined,
    };
  });
};

export const emptyEditorTree = {
  name: "Initial Flex State",
  timestamp: Date.now(),
  root: {
    id: "root",
    name: "Container",
    children: [
      {
        id: "content-wrapper",
        name: "Grid",
        children: [
          {
            id: "main-content",
            name: "GridColumn",
          },
        ],
      },
    ],
  },
};

export const emptyCssGridTree = {
  name: "Initial Grid State",
  timestamp: Date.now(),
  root: {
    id: "root",
    name: "Container",
    blockDroppingChildrenInside: false,
    children: [
      {
        id: "main-grid",
        name: "Container",
        description: "Container",
        blockDroppingChildrenInside: false,
        children: [],
      },
    ],
  },
};

const initialGridValues = requiredModifiers.grid;
const initialGridColumnValues = requiredModifiers.gridColumn;

export const emptyEditorAttrsTree = {
  root: {
    id: "root",
    name: "Container",
    description: "Root component",
    children: [
      {
        id: "content-wrapper",
        name: "Grid",
        description: "Body",
        props: {
          gridSize: GRID_SIZE,
          ...initialGridValues,
          gap: "0",
          style: {
            ...initialGridValues.style,
            minHeight: "20px",
          },
        },
        children: [
          {
            id: "main-content",
            name: "GridColumn",
            description: "Main Content",
            props: {
              span: GRID_SIZE,
              ...initialGridColumnValues,
              style: {
                ...initialGridColumnValues.style,
                minHeight: "100vh",
                paddingLeft: "0px",
                paddingTop: "0px",
                paddingRight: "0px",
                paddingBottom: "0px",
                backgroundSize: "contain",
                overflow: "auto",
              },
            },
          },
        ],
      },
    ],
  },
};

export function toSnakeCase(input: string): string {
  // Replace any existing underscores with spaces to standardize the input
  let temp = input.replace(/_/g, " ");

  // Insert an underscore before:
  // - A capital letter that follows a lowercase letter or a number
  // - A number that follows a letter
  temp = temp.replace(
    /((?<=[a-z])[A-Z]|(?<=[A-Z])[A-Z](?=[a-z])|(?<=[A-Za-z])(?=[0-9])|(?<=[0-9])(?=[A-Za-z]))/g,
    "_$1",
  );

  // Replace multiple spaces with a single space
  temp = temp.replace(/\s+/g, " ");

  // Trim spaces at the start and end, and replace remaining spaces with underscores
  temp = temp.trim().replace(/ /g, "_");

  // Convert to lowercase
  return temp?.toLowerCase();
}

export function removeEmpty(obj: Record<string, any>): Record<string, any> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (notEmpty(value)) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  );
}

function notEmpty(value: any): boolean {
  return (
    value !== "" &&
    notUndefined(value) &&
    !emptyArray(value) &&
    !emptyObject(value)
  );
}

export function notUndefined(value: any): boolean {
  return (
    value !== null &&
    value !== undefined &&
    value !== "undefined" &&
    value !== "null"
  );
}

function emptyArray(value: any): boolean {
  return Array.isArray(value) && value.length === 0;
}

export function emptyObject(value: any): boolean {
  return isObject(value) && Object.keys(value).length === 0;
}

export const cloneObject = <T>(obj: T): T => {
  const deepClone = (item: any): any => {
    if (item === null || typeof item !== "object") {
      return item;
    }
    if (Array.isArray(item)) {
      return item.map(deepClone);
    }
    const clonedObj: any = {};
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(item[key]);
      }
    }
    return clonedObj;
  };
  return deepClone(obj);
};

export const generateProjectSlugLink = (
  projectId: string,
  customDomain: string,
  slug: string,
): URL => {
  const hostName = window?.location?.hostname ?? "";
  const domain = hostName ?? "";
  const isLocalhost = process.env.NEXT_PUBLIC_APP_ENVIRONMENT === "local";
  const baseDomain = isLocalhost
    ? `${domain}:3000`
    : customDomain || process.env.NEXT_PUBLIC_DEPLOYED_DOMAIN;

  const prefix = isLocalhost || !customDomain ? `${projectId}.` : "";

  return new URL(
    `${isLocalhost ? "http" : "https"}://${prefix}${baseDomain}/${
      slug === "/" ? "" : slug
    }`,
  );
};

export function extractPagingFromSupabase<T>(
  contentRange: string,
  result: T,
): { results: T; paging: PagingModel } {
  const [rangePart, totalRecordsStr] = contentRange.split("/");
  const [startStr, endStr] = rangePart.split("-");

  const totalRecords = parseInt(totalRecordsStr, 10);
  const start = parseInt(startStr, 10);
  const end = parseInt(endStr, 10);

  const recordsPerPage = end - start + 1;
  const page = Math.ceil(end / recordsPerPage);

  const pagingModel: PagingModel = {
    totalRecords: totalRecords,
    recordsPerPage: recordsPerPage,
    page: page,
  };

  return {
    results: result,
    paging: pagingModel,
  };
}

export function isEmpty(value: any) {
  // Check for null or undefined
  if (value == null) return true;

  // Check for boolean
  if (typeof value === "boolean") return false;

  // Check for number
  if (typeof value === "number") return isNaN(value);

  // Check for string
  if (typeof value === "string") return value.trim().length === 0;

  // Check for array
  if (Array.isArray(value)) return value.length === 0;

  // Check for object
  if (typeof value === "object") {
    // Check if it's a Date object
    if (value instanceof Date) return isNaN(value.getTime());

    // Check if the object is empty
    return Object.keys(value).length === 0;
  }

  // Check for map or set
  if (value instanceof Map || value instanceof Set) return value.size === 0;

  // Check for function
  if (typeof value === "function") return false;

  // Default case for other types
  return false;
}

export const ensureHttps = (url: string): string => {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

export const isRestrictedComponent = (id: string = "") =>
  ["main-content", "content-wrapper", "root"].includes(id);
