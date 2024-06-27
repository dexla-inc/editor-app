import { ComponentType } from "react";
import { WithComponentWrapperProps } from "@/types/component";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { useComputeValue } from "@/hooks/data/useComputeValue";
import useFontFaceObserver from "use-font-face-observer";

export const withComponentVisibility = <T extends Record<string, any>>(
  Component: ComponentType<T>,
) => {
  const ComponentVisibilityWrapper = (props: WithComponentWrapperProps) => {
    const { component: componentTree, shareableContent } = props;
    let id = componentTree.id;

    if (shareableContent?.parentSuffix !== undefined) {
      id = `${componentTree.id}-related-${shareableContent?.parentSuffix}`;
    }

    const isFontLoaded = useFontFaceObserver([{ family: "Poppins" }]);

    const onLoad = useEditorTreeStore(
      useShallow(
        (state) => state.componentMutableAttrs[componentTree.id!]?.onLoad || {},
      ),
    );

    const computedOnLoad = useComputeValue({
      onLoad: { isVisible: onLoad.isVisible },
      shareableContent,
    });

    if (computedOnLoad.isVisible === false || !isFontLoaded) {
      return null;
    }

    // @ts-ignore
    return <Component {...props} id={id} />;
  };

  return ComponentVisibilityWrapper;
};
