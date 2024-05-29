import { useVariableStore } from "@/stores/variables";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useShallow } from "zustand/react/shallow";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useEditorStore } from "@/stores/editor";
import {
  Component,
  ComponentTree,
  getAllComponentsByName,
} from "@/utils/editor";
import { structureMapper } from "@/utils/componentMapper";
import { useInputsStore } from "@/stores/inputs";

type Props = {
  component: ComponentTree & Component;
  children?: (props: any) => JSX.Element;
};

const variablePattern = /variables\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;

export const ModalAndDrawerWrapper = ({ component, children }: Props) => {
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );
  const iframeWindow = useEditorStore((state) => state.iframeWindow);

  const { size, titleTag: tag, ...componentProps } = component.props as any;
  const { showInEditor = component.props?.showInEditor } =
    component.onLoad || {};
  const { titleStyle } = useBrandingStyles({ tag });

  const onLoad = useEditorTreeStore(
    useShallow((state) => state.componentMutableAttrs[component?.id!]?.onLoad),
  );

  const target = iframeWindow?.document.getElementById("iframe-content");

  const isSizeFullScreen = size === "fullScreen";
  const sizeProps = isSizeFullScreen
    ? {
        fullScreen: true,
      }
    : {
        size,
      };

  const handleClose = () => {
    const inputsComponentsList = Object.entries(structureMapper).reduce(
      (acc, [key, value]) => {
        if (value.category === "Input") {
          acc.push(key);
        }
        return acc;
      },
      [] as string[],
    );
    const inputFieldComponentIds = getAllComponentsByName(
      component,
      inputsComponentsList,
    ).map((c) => c.id!);

    const isVisibleBound = onLoad.isVisible.dataType === "boundCode";
    const resetVariable = useVariableStore.getState().resetVariable;
    if (isVisibleBound) {
      const boundVariables = extractKeysFromPattern(
        variablePattern,
        onLoad.isVisible.boundCode,
      );
      boundVariables.forEach((variable) => {
        resetVariable(variable);
      });
    }
    useInputsStore.getState().resetInputValues(inputFieldComponentIds);
  };
  return (
    <>
      {children &&
        children({
          isPreviewMode,
          target,
          showInEditor,
          componentProps,
          titleStyle,
          handleClose,
          sizeProps,
          isSizeFullScreen,
        })}
    </>
  );
};

function extractKeysFromPattern(pattern: RegExp, boundCode: any) {
  return [...boundCode.matchAll(pattern)].map((match) => match[1]);
}
