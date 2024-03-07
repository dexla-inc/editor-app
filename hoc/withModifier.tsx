import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import get from "lodash.get";
import merge from "lodash.merge";
import set from "lodash.set";

import { ComponentType } from "react";

type WithModifier = {
  selectedComponent: Component;
};

function getObjectPaths(obj: any, parentKey = ""): string[] {
  return Object.keys(obj).flatMap((key: string) => {
    const path = parentKey ? `${parentKey}.${key}` : key;
    return typeof obj[key] === "object" && obj[key] !== null
      ? getObjectPaths(obj[key], path)
      : path;
  });
}

function findIntersectedKeyValues(objects: Component[]) {
  const updatedObject = cloneDeep(objects[0]);
  const mergedObject = merge({}, ...objects);
  const paths = getObjectPaths(mergedObject);

  objects.slice(1).forEach((obj) => {
    paths.forEach((path) => {
      const sourceValue = get(updatedObject, path);
      const value = get(obj, path);

      if (sourceValue !== value) {
        set(updatedObject, path, null);
      }
    });
  });

  return updatedObject;
}

export const withModifier = (Modifier: ComponentType<WithModifier>) => {
  const Config = ({ initiallyOpened }: any) => {
    const hasSelectedComponentIds = useEditorStore(
      (state) => state.selectedComponentIds?.length,
    );
    const component = useEditorStore((state) => {
      const lastSelectedComponentId = state.selectedComponentIds?.[0]!;
      const currentState =
        state.currentTreeComponentsStates?.[lastSelectedComponentId] ??
        "default";
      const mergedCustomData = state.selectedComponentIds?.map((id) => {
        const selectedComponent = state.componentMutableAttrs[id];
        return merge(
          {},
          selectedComponent?.props,
          selectedComponent?.languages?.[state.language],
          selectedComponent?.states?.[currentState],
        );
      });

      return findIntersectedKeyValues(mergedCustomData as Component[]);
    });

    if (!initiallyOpened || !hasSelectedComponentIds) {
      return null;
    }

    return (
      <Modifier
        {...{
          selectedComponent: component as Component,
        }}
      />
    );
  };

  return Config;
};
