import { useAppMode } from "@/hooks/useAppMode";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { isSame } from "@/utils/componentComparison";
import { Component, EditableComponentMapper } from "@/utils/editor";
import { Box, Popover as MantinePopOver, PopoverProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { memo, useEffect } from "react";

type Props = EditableComponentMapper & Omit<PopoverProps, "opened">;

const PopOverComponent = ({
  renderTree,
  component,
  onClose: propOnClose,
  shareableContent,
  ...props
}: Props) => {
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const isLive = useEditorTreeStore((state) => state.isLive);

  const {
    children,
    opened: propOpened,
    targetId,
    loading,
    showInEditor,
    ...componentProps
  } = component.props as any;

  let targetComponent: Component | null = null;
  const [opened, { open, close }] = useDisclosure(propOpened);
  const childrenWithoutTarget = (children || component.children).reduce(
    (acc: any, item: any) => {
      if (item.id === targetId) {
        targetComponent = item;
        return acc;
      }
      return acc.concat(item);
    },
    [],
  );

  const handleClose = () => {
    close();
    propOnClose?.();
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

  const target = (isLive ? window : iframeWindow)?.document.getElementById(
    "iframe-content",
  );

  return (
    <MantinePopOver
      withinPortal
      trapFocus={false}
      opened={isPreviewMode ? opened : !showInEditor}
      width="auto"
      portalProps={{
        target: target,
      }}
      middlewares={{ flip: false, shift: false, inline: true }}
      onClose={isPreviewMode ? handleClose : () => {}}
      {...props}
      {...componentProps}
      maw="fit-content"
    >
      {targetComponent && (
        <MantinePopOver.Target>
          <Box id="popover-target">{renderTree(targetComponent)}</Box>
        </MantinePopOver.Target>
      )}

      <MantinePopOver.Dropdown w="auto">
        {childrenWithoutTarget && childrenWithoutTarget.length > 0
          ? childrenWithoutTarget?.map((child: any) => renderTree(child))
          : children}
      </MantinePopOver.Dropdown>
    </MantinePopOver>
  );
};

export const PopOver = memo(PopOverComponent, isSame);
