export function transformActionData(actionData: any) {
  const flattenObject = (
    obj: any,
    parentKey = "",
    res = {} as Record<string, any>,
  ) => {
    for (let key in obj) {
      const propName = parentKey ? `${parentKey}.${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  };

  if (typeof actionData === "string") {
    return [
      {
        id: "actionData",
        name: "actionData",
        value: actionData,
        type: "STRING",
      },
    ];
  } else if (Array.isArray(actionData)) {
    return actionData.map((item, index) => ({
      id: `actionData[${index}]`,
      name: `actionData[${index}]`,
      value: typeof item === "object" ? JSON.stringify(item) : item,
      type: typeof item === "object" ? "OBJECT" : typeof item.toUpperCase(),
    }));
  } else if (typeof actionData === "object") {
    const flattened = flattenObject(actionData);
    return Object.keys(flattened).map((key) => ({
      id: key,
      name: key,
      value:
        typeof flattened[key] === "object"
          ? JSON.stringify(flattened[key])
          : flattened[key],
      type:
        typeof flattened[key] === "object"
          ? "OBJECT"
          : typeof flattened[key].toUpperCase(),
    }));
  } else {
    return []; // or handle other types as needed
  }
}
