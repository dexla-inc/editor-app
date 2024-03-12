import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { useUserConfigStore } from "@/stores/userConfig";
import { EditableComponentMapper } from "@/utils/editor";
import { DrawerProps, Drawer as MantineDrawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

type Props = EditableComponentMapper & Omit<DrawerProps, "opened">;

export const Drawer = ({
  renderTree,
  component,
  onClose: propOnClose,
  ...props
}: Props) => {
  const theme = useThemeStore((state) => state.theme);
  const isPreviewMode = useUserConfigStore((state) => state.isPreviewMode);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);

  const {
    children,
    title,
    opened: propOpened,
    forceHide,
    ...componentProps
  } = component.props as any;

  const [opened, { open, close }] = useDisclosure(propOpened);

  const handleClose = () => {
    close();
    propOnClose && propOnClose();
    const updateTreeComponentAttrs =
      useEditorTreeStore.getState().updateTreeComponentAttrs;

    updateTreeComponentAttrs({
      componentIds: [component.id!],
      attrs: { props: { opened: false } },
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
      opened={isPreviewMode ? opened : !forceHide}
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
