import { FileWithPath } from "@mantine/dropzone";
import { requiredModifiers } from "./modifiers";
import { GRID_SIZE } from "./config";

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

export const getProjectType = (href: string): UrlType => {
  // Pattern to match editor URLs globally, not limited to a specific domain
  const editorPattern = new RegExp("/editor/[0-9a-fA-F]{32}$");

  // Specific patterns to identify project URLs within the 'dexla-inc.vercel.app' domain
  // and to accommodate for different project types like projects, playground, and team
  const projectPattern = new RegExp(
    "dexla-inc.vercel.app/(projects|playground|team)/[0-9a-fA-F]{32}",
  );

  if (editorPattern.test(href)) {
    // This now catches any URL ending with '/editor/' followed by a 32-char hex string, across any domain
    return "editor";
  } else if (href.includes("dexla-inc.vercel.app")) {
    if (projectPattern.test(href)) {
      // Matches specific project types within the 'dexla-inc.vercel.app' domain
      return "project";
    } else {
      // Other URLs within 'dexla-inc.vercel.app' that don't match the editor or project patterns
      return "project"; // Assuming generic project type for any non-editor URLs within this domain
    }
  } else if (
    // Checks for URLs starting with specific substrings indicating a 'project'
    href.startsWith("http://localhost:3000") ||
    href.startsWith("https://dev-app.dexla.ai") ||
    href.startsWith("https://beta.dexla.ai") ||
    href.startsWith("https://app.dexla.ai")
  ) {
    return "project";
  } else {
    // Defaults to 'live' for URLs that don't match any of the above conditions
    return "live";
  }
};

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
    let path = (prefix ? `${prefix}.${key}` : key).replaceAll(".[", "[");

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

const isArrayIndex = (prop: string): boolean => {
  // Check if prop is a non-negative integer (array index).
  return /^\d+$/.test(prop);
};

export const emptyEditorTree = {
  name: "Initial State",
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
