import { useEditorStore } from "@/stores/editor";
import { Component, checkIfIsChild } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & Omit<ModalProps, "opened">;

export const Modal = ({
  renderTree,
  component,
  onClose: propOnClose,
  ...props
}: Props) => {
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const theme = useEditorStore((state) => state.theme);
  const isPreviewMode = component.isPreviewMode ?? false;
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );

  const {
    children,
    title,
    opened: propOpened,
    style,
    forceHide,
    ...componentProps
  } = component.props as any;

  const [opened, { open, close }] = useDisclosure(propOpened);

  const handleClose = () => {
    close();
    propOnClose && propOnClose();
    updateTreeComponent(component.id!, { opened: false }, false);
  };

  useEffect(() => {
    if (propOpened) open();
    if (!propOpened) close();
  }, [close, open, propOpened]);

  return (
    <MantineModal
      centered
      withinPortal
      trapFocus={false}
      lockScroll={false}
      target={iframeWindow?.document.getElementById("iframe-content")}
      opened={
        isPreviewMode
          ? opened
          : (selectedComponentId === component.id ||
              checkIfIsChild(component, selectedComponentId as string)) &&
            !forceHide
      }
      onClose={isPreviewMode ? handleClose : () => {}}
      title={title}
      {...props}
      {...componentProps}
      styles={{
        content: style ?? {},
        body: { height: "fit-content" },
        title: { fontFamily: theme.fontFamily },
      }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineModal>
  );
};
