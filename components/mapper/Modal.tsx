import { useEditorStore } from "@/stores/editor";
import { Component, checkIfIsChild } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & Omit<ModalProps, "opened">;

export const Modal = ({ renderTree, component, ...props }: Props) => {
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const theme = useEditorStore((state) => state.theme);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  // const updateTreeComponent = useEditorStore(
  //   (state) => state.updateTreeComponent,
  // );
  console.log(component);
  const { children, title, opened, forceHide, size, ...componentProps } =
    component.props as any;

  // const [opened, { open, close }] = useDisclosure(propOpened);

  // const handleClose = () => {
  //   close();
  //   propOnClose && propOnClose();
  //   updateTreeComponent({
  //     componentId: component.id!,
  //     props: { opened: false },
  //     save: false,
  //   });
  // };

  // useEffect(() => {
  //   if (propOpened) open();
  //   if (!propOpened) close();
  // }, [close, open, propOpened]);

  const target = iframeWindow?.document.getElementById("iframe-content");

  const isSizeFullScreen = size === "fullScreen";
  const sizeProps = isSizeFullScreen
    ? {
        fullScreen: true,
      }
    : {
        size,
      };

  return (
    <MantineModal
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
              checkIfIsChild(component, selectedComponentId as string)) &&
            !forceHide
      }
      {...props}
      {...componentProps}
      onClose={() => {}}
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
};
