export const cloneObject = <T>(obj: T): T => {
  const deepClone = (item: any): any => {
    if (item === null || typeof item !== "object") {
      return item;
    }
    if (Array.isArray(item)) {
      return item.map(deepClone);
    }
    const clonedObj: any = {};
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(item[key]);
      }
    }
    return clonedObj;
  };
  return deepClone(obj);
};
