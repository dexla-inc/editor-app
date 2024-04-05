import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useAppMode } from "@/hooks/useAppMode";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { forwardRef, memo, useEffect, useState } from "react";

type Props = EditableComponentMapper & Omit<ModalProps, "opened">;

export const ModalComponent = forwardRef(
  (
    { renderTree, component, style, shareableContent, ...props }: Props,
    ref,
  ) => {
    const theme = useThemeStore((state) => state.theme);
    const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
    const iframeWindow = useEditorStore((state) => state.iframeWindow);

    const { forceHide, size, ...componentProps } = component.props as any;

    console.log("ModalComponent", component, forceHide);
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
      const updateTreeComponentAttrs =
        useEditorTreeStore.getState().updateTreeComponentAttrs;

      updateTreeComponentAttrs({
        componentIds: [component.id!],
        attrs: { props: { opened: false, style: { display: "none" } } },
        save: false,
      });
      setIsVisible(false);
    };

    const visibleStyle = style && style.display !== "none";
    const [isVisible, setIsVisible] = useState(visibleStyle);

    useEffect(() => {
      setIsVisible(visibleStyle);
    }, [visibleStyle]);

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
        //opened={isVisible}
        opened={isPreviewMode ? isVisible : !forceHide}
        {...props}
        {...componentProps}
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
