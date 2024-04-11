import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { useComputeValue2 } from "@/hooks/dataBinding/useComputeValue2";
import { useVariableStore } from "@/stores/variables";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & Omit<ModalProps, "opened">;
const variablePattern = /variables\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;

export const ModalComponent = forwardRef(
  (
    { renderTree, component, style, shareableContent, ...props }: Props,
    ref,
  ) => {
    const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
    const iframeWindow = useEditorStore((state) => state.iframeWindow);

    const { size, titleTag: tag, ...componentProps } = component.props as any;
    const { titleStyle } = useBrandingStyles({ tag });

    const onLoad = useEditorTreeStore(
      useShallow(
        (state) => state.componentMutableAttrs[component?.id!]?.onLoad,
      ),
    );

    // This is not forceHide this is showInEditor
    const { showInEditor } = useComputeValue2({
      onLoad,
      shareableContent,
    });

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
    };

    return (
      <MantineModal
        ref={ref}
        centered
        withinPortal
        trapFocus={false}
        lockScroll={false}
        target={target}
        {...sizeProps}
        {...props}
        {...componentProps}
        opened={isPreviewMode ? true : showInEditor}
        onClose={handleClose}
        styles={{
          content: style ?? {},
          body: { height: "fit-content" },
          title: { ...titleStyle },
          //title: { fontFamily: theme.fontFamily, fontSize: 50 },
          ...(isSizeFullScreen && { inner: { left: 0 } }),
        }}
      >
        {component.children?.map((child) => renderTree(child))}
      </MantineModal>
    );
  },
);
ModalComponent.displayName = "Modal";

export const Modal = memo(withComponentWrapper<Props>(ModalComponent), isSame);

function extractKeysFromPattern(pattern: RegExp, boundCode: any) {
  return [...boundCode.matchAll(pattern)].map((match) => match[1]);
}
