import { useEditorStore } from "@/stores/editor";
import { Component, getAllComponentsByIds } from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import get from "lodash.get";
import merge from "lodash.merge";
import set from "lodash.set";

import { ComponentType, useMemo } from "react";

type WithModifier = {
  selectedComponentIds: string[];
  selectedComponent: Component;
  currentState: string;
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
    const selectedComponentIds = useEditorStore(
      (state) => state.selectedComponentIds,
    );
    const selectedComponents = useEditorStore((state) =>
      Object.entries(state.componentMutableAttrs).reduce(
        (acc, [id, component]) => {
          if (selectedComponentIds?.includes(id)) {
            acc.push(component);
          }
          return acc;
        },
        [] as Component[],
      ),
    );
    const language = useEditorStore((state) => state.language);
    const currentTreeComponentsStates = useEditorStore(
      (state) => state.currentTreeComponentsStates,
    );

    const currentState =
      currentTreeComponentsStates?.[selectedComponentIds?.[0] || ""] ??
      "default";

    const mergedCustomData = useMemo(() => {
      return selectedComponents?.map((selectedComponent) => {
        merge(
          {},
          selectedComponent?.props,
          selectedComponent?.languages?.[language],
          selectedComponent?.states?.[currentState],
        );
        return selectedComponent;
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponents, currentState, language]);

    const component = findIntersectedKeyValues(mergedCustomData as Component[]);

    if (!initiallyOpened || !selectedComponentIds?.length) {
      return null;
    }

    return (
      <Modifier
        {...{
          selectedComponentIds: selectedComponentIds!,
          selectedComponent: component as Component,
          currentState,
        }}
      />
    );
  };

  return Config;
};
