import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  Component,
  ComponentTree,
  EditableComponentMapper,
} from "@/utils/editor";
import { Box, Popover as MantinePopOver, PopoverProps } from "@mantine/core";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { pick } from "next/dist/lib/pick";
import merge from "lodash.merge";

type Props = EditableComponentMapper & Omit<PopoverProps, "opened">;

const PopOverComponent = ({
  renderTree,
  component,
  onClose: propOnClose,
  shareableContent,
  ...props
}: Props) => {
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const isLive = useEditorTreeStore((state) => state.isLive);

  const { targetId, loading, showInEditor, ...componentProps } =
    component.props as any;

  const { style, ...restProps } = props;

  let targetComponent: Component | null = null;
  const childrenWithoutTarget: ComponentTree[] = (
    component.children ?? []
  ).reduce((acc: any, item: any) => {
    if (item.id === targetId) {
      targetComponent = item;
      return acc;
    }
    return acc.concat(item);
  }, []);

  const target = (isLive ? window : iframeWindow)?.document.getElementById(
    "iframe-content",
  );

  const customStyle = merge({}, props.style);

  return (
    <MantinePopOver
      withinPortal
      trapFocus={false}
      {...(!isPreviewMode && showInEditor ? { opened: true } : {})}
      width="auto"
      portalProps={{
        target: target,
      }}
      middlewares={{ flip: false, shift: false, inline: true }}
      {...restProps}
      {...componentProps}
      styles={{
        dropdown: {
          ...pick(customStyle, rootStyleProps),
        },
      }}
    >
      {targetComponent && (
        <MantinePopOver.Target>
          <Box id="popover-target">{renderTree(targetComponent)}</Box>
        </MantinePopOver.Target>
      )}

      <MantinePopOver.Dropdown w="auto">
        {childrenWithoutTarget?.map((child) => renderTree(child))}
      </MantinePopOver.Dropdown>
    </MantinePopOver>
  );
};

const rootStyleProps = [
  "padding",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingBottom",
  "border",
  "borderBottomColor",
  "borderColor",
  "borderLeftColor",
  "borderRightColor",
  "borderTopColor",
  "background",
];

export const PopOver = memo(withComponentWrapper(PopOverComponent));
