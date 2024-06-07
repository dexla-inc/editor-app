import { useEditorTreeStore } from "@/stores/editorTree";
import has from "lodash.has";

export function extractKeys(
  obj: Record<string, any> | null | undefined,
  parentKey: string = "",
): string[] {
  if (obj === null || obj === undefined) return []; // Handle null or undefined input early

  let keys: string[] = [];

  if (Array.isArray(obj)) {
    // If the object is an array, iterate over each element
    obj.forEach((item) => {
      keys = keys.concat(extractKeys(item, parentKey));
    });
  } else if (!Array.isArray(obj)) {
    // Ensure we only process objects
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // Recurse into nested objects
        keys = keys.concat(extractKeys(value, newKey));
      } else {
        // Collect key if it's not an object or it's an array
        keys.push(newKey);
      }
    });
  }

  return keys;
}

export const relatedKeys = ["data", "parent", "grandparent"];

export const getStaticLanguageValue = (componentId: string, key: string) => {
  const { componentMutableAttrs, language } = useEditorTreeStore.getState();
  const component = componentMutableAttrs[componentId];

  const staticValue = component.onLoad?.[key]?.static;
  const result: Record<string, any> = {
    [key]: {
      static: {},
    },
  };
  ["en", language].forEach((lang) => {
    const value = has(staticValue, lang)
      ? staticValue[lang]
      : has(staticValue, "en")
        ? // @ts-ignore
          staticValue.en
        : // if no translation key was found but it has the dataType attr, it means it was set before
          // (for backwards compatibility when we had no language)
          has(component.onLoad?.[key], "dataType")
          ? staticValue
          : // otherwise, return the value from props
            component.props?.[key] ?? "";
    result[key].static[lang] = value;
  });

  return result;
};
