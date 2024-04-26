export function extractKeys(
  obj: Record<string, any> | null | undefined,
  parentKey: string = "",
): string[] {
  if (obj === null || obj === undefined) return []; // Handle null or undefined input early

  let keys: string[] = [];

  if (!Array.isArray(obj)) {
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
