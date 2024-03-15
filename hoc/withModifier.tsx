import { Component } from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import get from "lodash.get";
import merge from "lodash.merge";
import set from "lodash.set";

import { ComponentType, useMemo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";

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
    const selectedComponents = useEditorTreeStore((state) =>
      Object.entries(state.componentMutableAttrs).reduce(
        (acc, [id, component]) => {
          if (state.selectedComponentIds?.includes(id)) {
            acc.push(component);
          }
          return acc;
        },
        [] as Component[],
      ),
    );
    const language = "en";
    const currentState = useEditorTreeStore(
      (state) =>
        state.currentTreeComponentsStates?.[
          state.selectedComponentIds?.at(-1)!
        ] ?? "default",
    );

    const mergedCustomData = useMemo(() => {
      return selectedComponents?.map((selectedComponent) => {
        const mergedComponent = merge(
          {},
          selectedComponent,
          { props: selectedComponent?.languages?.[language] },
          { props: selectedComponent?.states?.[currentState] },
        );
        return mergedComponent;
      });
    }, [selectedComponents, currentState, language]);

    const component = findIntersectedKeyValues(mergedCustomData as Component[]);

    if (!initiallyOpened || !selectedComponents?.length) {
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
