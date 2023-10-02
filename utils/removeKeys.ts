type Object = { [key: string]: any };

export const removeKeysRecursive = (
  obj: Object,
  keysToRemove: string[],
): Object => {
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    if (!keysToRemove.includes(key)) {
      if (typeof obj[key] === "object") {
        // @ts-ignore
        result[key] = removeKeysRecursive(obj[key], keysToRemove);
      } else {
        // @ts-ignore
        result[key] = obj[key];
      }
    }
  }
  return result;
};
