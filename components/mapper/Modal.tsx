import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useAppMode } from "@/hooks/useAppMode";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & Omit<ModalProps, "opened">;

export const ModalComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const theme = useThemeStore((state) => state.theme);
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
      const updateTreeComponentAttrs =
        useEditorTreeStore.getState().updateTreeComponentAttrs;

      updateTreeComponentAttrs({
        componentIds: [component.id!],
        attrs: { props: { opened: false } },
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
        opened={isPreviewMode ? opened : !forceHide}
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
