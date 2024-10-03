import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useInputsStore } from "@/stores/inputs";
import { useVariableStore } from "@/stores/variables";
import { RuleItemProps } from "@/types/dataBinding";
import { structureMapper } from "@/libs/dnd-flex/utils/componentMapper";
import {
  Component,
  ComponentTree,
  getAllComponentsByName,
} from "@/utils/editor";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = {
  component: ComponentTree & Component;
  children?: (props: any) => JSX.Element;
};

const variablePattern = /variables\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;

export const ModalAndDrawerWrapper = ({ component, children }: Props) => {
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );
  const resetInputValues = useInputsStore((state) => state.resetInputValues);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);

  const {
    size,
    titleTag: tag,
    triggers,
    ...componentProps
  } = component.props as any;
  const {
    title = componentProps?.title,
    showInEditor = componentProps?.showInEditor,
  } = component.onLoad || {};
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

  useEffect(() => {
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
    resetInputValues(inputFieldComponentIds);
  }, []);

  const handleClose = () => {
    const resetVariable = useVariableStore.getState().resetVariable;

    if (onLoad.isVisible.dataType === "boundCode") {
      const boundVariables = extractKeysFromPattern(
        variablePattern,
        onLoad.isVisible.boundCode ?? "",
      );

      boundVariables.forEach((variable) => {
        resetVariable(variable);
      });
    }

    if (onLoad.isVisible.dataType === "rules") {
      const ruleValueVariables = extractKeysFromPattern(
        variablePattern,
        onLoad.isVisible.rules?.value?.boundCode ?? "",
      );
      const ruleConditionVariables = onLoad.isVisible.rules?.rules?.flatMap(
        (rule: RuleItemProps) => {
          return rule.conditions?.flatMap((condition) =>
            extractKeysFromPattern(variablePattern, condition.location ?? ""),
          );
        },
      );

      [...ruleConditionVariables, ...ruleValueVariables].forEach((variable) => {
        resetVariable(variable);
      });
    }
  };
  return (
    <div {...triggers}>
      {children &&
        children({
          isPreviewMode,
          target,
          title,
          showInEditor,
          componentProps,
          titleStyle,
          handleClose,
          sizeProps,
          isSizeFullScreen,
        })}
    </div>
  );
};

function extractKeysFromPattern(pattern: RegExp, boundCode: any) {
  return [...boundCode.matchAll(pattern)].map((match) => match[1]);
}
