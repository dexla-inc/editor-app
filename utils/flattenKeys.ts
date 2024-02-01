export const flattenKeys = (
  object: object,
  initialPathPrefix: string = "",
): any => {
  if (!object || typeof object !== "object") {
    return [{ [initialPathPrefix]: object }];
  }

  const isArray = Array.isArray(object);

  const prefix = initialPathPrefix
    ? isArray
      ? initialPathPrefix
      : `${initialPathPrefix}.`
    : "";

  return Object.keys(object)
    .flatMap((key) => {
      return isArray
        ? {
            [`${prefix}[${key}]`]: object,
            ...flattenKeys(
              // @ts-ignore
              object[key],
              `${prefix}[${key}]`,
            ),
          }
        : flattenKeys(
            // @ts-ignore
            object[key],
            isArray ? `${prefix}[${key}]` : `${prefix}${key}`,
          );
    })
    .reduce((acc, path) => {
      if (path.hasOwnProperty("0")) {
        delete path["0"];
        return {
          ...acc,
          ...path,
        };
      }
      return { ...acc, ...path };
    }, {});
};
