import { useEditorStore } from "@/stores/editor";
import { Component, checkIfIsChild } from "@/utils/editor";
import { DrawerProps, Drawer as MantineDrawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & Omit<DrawerProps, "opened">;

export const Drawer = ({
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
    <MantineDrawer
      withinPortal
      trapFocus={false}
      lockScroll={false}
      target={iframeWindow?.document.getElementById("iframe-content")}
      opened={
        isPreviewMode
          ? opened
          : selectedComponentId === component.id ||
            checkIfIsChild(component, selectedComponentId as string)
      }
      onClose={isPreviewMode ? handleClose : () => {}}
      title={title}
      {...props}
      {...componentProps}
      styles={{
        title: { fontFamily: theme.fontFamily },
        body: { height: "fit-content" },
      }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineDrawer>
  );
};
