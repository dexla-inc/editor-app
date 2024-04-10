import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { memoize } from "proxy-memoize";
import { useComputeValue2 } from "@/hooks/dataBinding/useComputeValue2";
import { useVariableStore } from "@/stores/variables";

type Props = EditableComponentMapper & Omit<ModalProps, "opened">;
const variablePattern = /variables\[\s*(?:\/\*[\s\S]*?\*\/\s*)?'(.*?)'\s*\]/g;

export const ModalComponent = forwardRef(
  (
    { renderTree, component, style, shareableContent, ...props }: Props,
    ref,
  ) => {
    const theme = useThemeStore((state) => state.theme);
    const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
    const iframeWindow = useEditorStore((state) => state.iframeWindow);

    const { size, ...componentProps } = component.props as any;

    const onLoad = useEditorTreeStore(
      memoize((state) => state.componentMutableAttrs[component?.id!]?.onLoad),
    );
    const { forceHide } = useComputeValue2({
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
        withCloseButton={false}
        target={target}
        {...sizeProps}
        {...props}
        {...componentProps}
        opened={isPreviewMode ? true : !forceHide}
        onClose={handleClose}
        styles={{
          content: style ?? {},
          body: { height: "fit-content" },
          title: { fontFamily: theme.fontFamily },
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
