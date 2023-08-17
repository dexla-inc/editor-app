import { useEditorStore } from "@/stores/editor";
import { Component, checkIfIsChild } from "@/utils/editor";
import {
  PopoverProps,
  Popover as MantinePopOver,
  Popover,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { componentMapper } from "@/utils/componentMapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & Omit<PopoverProps, "opened">;

export const PopOver = ({
  renderTree,
  component,
  onClose: propOnClose,
  ...props
}: Props) => {
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );
  const iframeWindow = useEditorStore((state) => state.iframeWindow);

  const {
    children,
    title,
    opened: propOpened,
    style,
    targetId,
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
    []
  );

  const handleClose = () => {
    close();
    propOnClose && propOnClose();
    updateTreeComponent(component.id!, { opened: false }, false);
  };

  useEffect(() => {
    if (propOpened) open();
    if (!propOpened) close();
  }, [close, open, propOpened]);

  const isOpened = isPreviewMode
    ? opened
    : selectedComponentId === component.id ||
      checkIfIsChild(component, selectedComponentId as string);

  return (
    <MantinePopOver
      withinPortal
      trapFocus={false}
      opened={isOpened}
      portalProps={{
        target: iframeWindow?.document.getElementById("iframe-content"),
      }}
      onClose={isPreviewMode ? handleClose : () => {}}
      {...props}
      {...componentProps}
    >
      {targetComponent && (
        <MantinePopOver.Target>
          {/* @ts-ignore */}
          {componentMapper[targetComponent?.name || ""].Component({
            component: targetComponent,
            renderTree,
          })}
        </MantinePopOver.Target>
      )}

      <MantinePopOver.Dropdown>
        {childrenWithoutTarget && childrenWithoutTarget.length > 0
          ? childrenWithoutTarget?.map((child: any) => renderTree(child))
          : children}
      </MantinePopOver.Dropdown>
    </MantinePopOver>
  );
};
