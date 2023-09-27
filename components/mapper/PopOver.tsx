import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { componentMapper } from "@/utils/componentMapper";
import { Component, checkIfIsChild } from "@/utils/editor";
import { Popover as MantinePopOver, PopoverProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { memo, useEffect } from "react";
import { MantineSkeleton } from "./skeleton/Skeleton";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & Omit<PopoverProps, "opened">;

const PopOverComponent = ({
  renderTree,
  component,
  onClose: propOnClose,
  ...props
}: Props) => {
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );
  const iframeWindow = useEditorStore((state) => state.iframeWindow);

  const {
    children,
    title,
    opened: propOpened,
    style,
    targetId,
    loading,
    ...componentProps
  } = component.props as any;

  // check if data is being fetched
  const isLoading = loading ?? false;

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

  if (isLoading)
    <MantineSkeleton height={style.height ?? 700} width={style.width ?? 500} />;

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

export const PopOver = memo(PopOverComponent, isSame);
