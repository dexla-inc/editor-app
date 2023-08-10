import get from "lodash.get";

export const flattenKeys = (
  object: object,
  initialPathPrefix: string = ""
): any => {
  if (!object || typeof object !== "object") {
    return [{ [initialPathPrefix]: object }];
  }

  const prefix = initialPathPrefix
    ? Array.isArray(object)
      ? initialPathPrefix
      : `${initialPathPrefix}.`
    : "";

  return Object.keys(object)
    .flatMap((key) =>
      flattenKeys(
        // @ts-ignore
        object[key],
        Array.isArray(object) ? `${prefix}[${key}]` : `${prefix}${key}`
      )
    )
    .reduce((acc, path) => {
      return { ...acc, ...path };
    }, []);
};

export const flattenKeysWithRoot = (object: object) => {
  const flatten = flattenKeys(object, "root");
  return Object.keys(flatten).reduce((acc: any, key: string, index: number) => {
    const value = get(flatten, key);

    if (index === 0 && key.split(".")[0].endsWith("[0]")) {
      return {
        [key.split(".")[0]]: object,
        [key]: value,
        ...acc,
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});
};
