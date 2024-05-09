import { Component } from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import get from "lodash.get";
import merge from "lodash.merge";
import set from "lodash.set";

import { ComponentType, useMemo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import {
  selectedComponentIdSelector,
  selectedComponentIdsSelector,
} from "@/utils/componentSelectors";

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
  const ModifierWrapper = ({ initiallyOpened }: any) => {
    const component = useEditorTreeStore(
      useShallow((state) => {
        const selectedComponents = Object.entries(
          state.componentMutableAttrs,
        ).reduce((acc, [id, component]) => {
          if (selectedComponentIdsSelector(state)?.includes(id)) {
            acc.push(component);
          }
          return acc;
        }, [] as Component[]);

        if (!selectedComponents.length) {
          return null;
        }

        const language = "en";
        const selectedComponentId = selectedComponentIdSelector(state);
        const currentState =
          state.currentTreeComponentsStates?.[selectedComponentId!] ??
          "default";

        const mergedCustomData = selectedComponents?.map(
          (selectedComponent) => {
            const mergedComponent = merge(
              {},
              selectedComponent,
              { props: selectedComponent?.languages?.[language] },
              { props: selectedComponent?.states?.[currentState] },
            );
            return mergedComponent;
          },
        );

        return findIntersectedKeyValues(mergedCustomData as Component[]);
      }),
    );

    if (!initiallyOpened || !component) {
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

  return ModifierWrapper;
};
