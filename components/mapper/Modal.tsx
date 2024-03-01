import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useAppMode } from "@/hooks/useAppMode";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper, getComponentById } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & Omit<ModalProps, "opened">;

export const ModalComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const selectedComponentId = useEditorStore(
      (state) => state.selectedComponentIds?.at(-1),
    );
    const theme = useEditorStore((state) => state.theme);
    const { isPreviewMode } = useAppMode();
    const iframeWindow = useEditorStore((state) => state.iframeWindow);

    const {
      children,
      title,
      opened,
      onclose,
      forceHide,
      size,
      ...componentProps
    } = component.props as any;

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
      onclose && onclose();
      const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

      updateTreeComponent({
        componentId: component.id!,
        props: { opened: false },
        save: false,
      });
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
        opened={
          isPreviewMode
            ? opened
            : (selectedComponentId === component.id ||
                !!getComponentById(component, selectedComponentId as string)) &&
              !forceHide
        }
        {...props}
        {...componentProps}
        onClose={handleClose}
        styles={{
          content: props.style ?? {},
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
