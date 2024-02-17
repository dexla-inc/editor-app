// This extracts keys in the format .$. for arrays and . for nested objects.
export function extractKeys(
  obj: Array<{}> | Array<number | string> | {},
  parentKey: string = "",
): string[] {
  if (obj === null || obj === undefined) return [];

  let keys: string[] = [];

  const isArrayOfObjects =
    Array.isArray(obj) && obj.every((item) => typeof item === "object");

  const objToIterate = isArrayOfObjects ? obj[0] : obj;

  Object.entries(objToIterate).forEach(([key, value]) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        keys.push(`${newKey}.$`);
        if (value.length > 0 && typeof value[0] === "object") {
          keys = keys.concat(extractKeys(value[0], `${newKey}.$`));
        }
      } else {
        keys = keys.concat(extractKeys(value, newKey));
      }
    } else {
      keys.push(newKey);
    }
  });

  return keys;
}
