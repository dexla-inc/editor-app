import { FileWithPath } from "@mantine/dropzone";
import { NextRouter } from "next/router";

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

export const isEditor = (baseUrl: string) => {
  return (
    baseUrl?.startsWith("http://localhost:3000") ||
    baseUrl?.startsWith("localhost:3000") ||
    baseUrl?.includes("dexla.ai")
  );
};

export type UrlType = "project" | "live" | "editor";

export const getProjectType = (href: string): UrlType => {
  // Global editor pattern, not domain specific
  const globalEditorPattern = new RegExp(
    "[0-9a-fA-F]{32}/editor/[0-9a-fA-F]{32}$",
  );

  // Check specifically for dexla-inc.vercel.app domain URLs
  if (href.includes("dexla-inc.vercel.app")) {
    // Updated pattern to match editor URLs within dexla-inc.vercel.app domain
    const editorPattern = new RegExp(
      "dexla-inc.vercel.app.*/editor/[0-9a-fA-F]{32}$",
    );
    // Updated pattern to match project URLs (projects, playground, and team)
    const projectPattern = new RegExp(
      "dexla-inc.vercel.app/(projects|playground|team)/[0-9a-fA-F]{32}",
    );

    if (editorPattern.test(href)) {
      return "editor";
    } else if (projectPattern.test(href)) {
      return "project";
    } else {
      return "live";
    }
  } else if (globalEditorPattern.test(href)) {
    // This checks for an editor pattern globally if the specific domain check fails
    return "editor";
  } else if (
    // Check for other specific conditions based on URL starting strings
    href.startsWith("http://localhost:3000") ||
    href.startsWith("https://dev-app.dexla.ai") ||
    href.startsWith("https://beta.dexla.ai") ||
    href.startsWith("https://app.dexla.ai")
  ) {
    return "project";
  } else {
    // Default to "live" if no other conditions are met
    return "live";
  }
};

// where 7eacfa0cbb8b406cbc2b40085b9c37a4 is the project id and can be any string that contains only letters and numbers,
// but always has 32 characters and a mix of letters and numbers
export function isAppUrl(baseUrl: string): boolean {
  const pattern = new RegExp(
    "^[a-zA-Z0-9]{32}\\.dexla\\.(io|ai|localhost:3000)$",
  );
  return pattern.test(baseUrl) || baseUrl?.endsWith(".localhost:3000");
}

export function isLiveUrl(baseUrl: string, router: NextRouter): boolean;
export function isLiveUrl(baseUrl: string, pathName: string): boolean;

export function isLiveUrl(
  baseUrl: string,
  secondParam: NextRouter | string,
): boolean {
  const appUrl = isAppUrl(baseUrl);

  if (typeof secondParam === "string") {
    return secondParam === "/[page]" || appUrl;
  } else {
    return secondParam?.pathname === "/[page]" || appUrl;
  }
}

export function remToPixelUnit(rem: string) {
  const remValue = parseFloat(rem);
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );

  return `${remValue * rootFontSize}px`;
}
