import { FileWithPath } from "@mantine/dropzone";

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

export const isInput = (componentName: string) => {
  const inputCategories = [
    "Input",
    "Checkbox",
    "Radio",
    "Switch",
    "Select",
    "RadioGroup",
    "Textarea",
    "DateInput",
  ];
  return inputCategories.some((category) => componentName.includes(category));
};

export const getComponentInitialDisplayValue = (componentName: string) => {
  const defaultDisplayValues: { [key: string]: string } = {
    Grid: "grid",
    GridColumn: "grid",
    Container: "flex",
  };

  return defaultDisplayValues[componentName] || "block";
};

export function getObjectAndArrayKeys(obj: any, prefix = "") {
  let keys: string[] = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        keys.push(newKey);

        if (!Array.isArray(obj[key])) {
          keys = keys.concat(getObjectAndArrayKeys(obj[key], newKey));
        }
      }
    }
  }

  return keys;
}

// check if url follow the pattern: 7eacfa0cbb8b406cbc2b40085b9c37a4.dexla.io or 7eacfa0cbb8b406cbc2b40085b9c37a4.dexla.ai
// where 7eacfa0cbb8b406cbc2b40085b9c37a4 is the project id and can be any string that contains only letters and numbers,
// but always has 32 characters and a mix of letters and numbers
export function isLiveUrl(baseUrl: string): boolean {
  const pattern = new RegExp(
    "^[a-zA-Z0-9]{32}\\.dexla\\.(io|ai|localhost:3000)$",
  );
  return pattern.test(baseUrl) || baseUrl?.endsWith(".localhost:3000");
}
