import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { Component, getComponentById } from "@/utils/editor";
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
    (state) => state.selectedComponentIds?.at(-1),
  );
  const theme = useEditorStore((state) => state.theme);
  const isPreviewMode = useUserConfigStore((state) => state.isPreviewMode);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);

  const {
    children,
    title,
    opened: propOpened,
    ...componentProps
  } = component.props as any;

  const [opened, { open, close }] = useDisclosure(propOpened);

  const handleClose = () => {
    close();
    propOnClose && propOnClose();
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

    updateTreeComponent({
      componentId: component.id!,
      props: { opened: false },
      save: false,
    });
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
            !!getComponentById(component, selectedComponentId as string)
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
