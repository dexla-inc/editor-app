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

export const getComponentInitialDisplayValue = (componentName: string) => {
  const defaultDisplayValues: { [key: string]: string } = {
    Grid: "grid",
    GridColumn: "grid",
    Container: "flex",
  };

  return defaultDisplayValues[componentName] || "block";
};

export const isEditor = (hrefUrl: string) => {
  const urlType = getProjectType(hrefUrl);

  return urlType !== "live";
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

export function remToPixelUnit(rem: string) {
  const remValue = parseFloat(rem);
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );

  return `${remValue * rootFontSize}px`;
}

export function safeJsonParse<T>(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export function safeJsonParseWithReturn(str: string) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export function jsonInString(value: any) {
  return (
    typeof value === "string" &&
    (value.startsWith("{") || value.startsWith("["))
  );
}

export function objectInStringWithReturn(value: any) {
  return (
    typeof value === "string" &&
    (value.startsWith("return {") ||
      value.startsWith("return [") ||
      jsonInString(value))
  );
}

export function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
  //return Object.prototype.toString.call(value) === "[object Object]";
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

export const objToItems = (obj: any, root: any): ObjectItem[] => {
  if (!obj) return [];
  return Object.entries(obj).map(([key, value]) => {
    let path = findPathForKeyValue(root, key, value);

    return {
      key,
      value: JSON.stringify(value),
      path: path ? path.replaceAll(".[", "[") : "",
      type: typeof value,
      children:
        value && typeof value === "object"
          ? objToItems(value, root)
          : undefined,
    };
  });
};

export const findPathForKeyValue = (
  obj: any,
  key: string,
  value: any,
  currentPath: string = "",
): string | null => {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const newPath = currentPath
        ? `${currentPath}.${isArrayIndex(prop) ? `[${prop}]` : prop}`
        : isArrayIndex(prop)
        ? `[${prop}]`
        : prop;

      if (prop === key && obj[prop] === value) {
        return newPath;
      } else if (typeof obj[prop] === "object" && obj[prop] !== null) {
        const path = findPathForKeyValue(obj[prop], key, value, newPath);
        if (path !== null) {
          return path;
        }
      }
    }
  }

  return null;
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
                height: "100vh",
                paddingLeft: "0px",
                paddingTop: "0px",
                paddingRight: "0px",
                paddingBottom: "0px",
                backgroundSize: "contain",
              },
            },
          },
        ],
      },
    ],
  },
};
