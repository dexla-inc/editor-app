import isEmpty from "lodash.isempty";
import { relatedKeys } from "@/utils/data";
import { cloneObject } from "@/utils/common";

export const useDataTransformers = () => {
  // it transforms the related data to the format: { index: number, data: any, parent: any, grandparent: any }
  const itemTransformer = (relatedComponentsData: any) => {
    const relatedComponentsDataList = Object.entries(
      relatedComponentsData,
    ).filter(([, value]) => !isEmpty(value));

    const itemData = relatedComponentsDataList?.at(-1);
    const currentIndex = itemData?.[0]?.split("__")?.[1];

    return cloneObject(relatedComponentsDataList)
      ?.reverse()
      .reduce(
        (acc, [key, value], i) => {
          acc[relatedKeys[i]] = value;
          return acc;
        },
        {
          ...(currentIndex !== undefined && { index: currentIndex }),
        } as any,
      );
  };

  // TODO: add all the other shared data transformers like: variables, components, actions, etc...

  return {
    itemTransformer,
  };
};
