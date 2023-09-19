import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Text as MantineText, TextProps } from "@mantine/core";
import get from "lodash.get";
import { memo, useRef, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextProps;

const TextComponent = ({ renderTree, component, ...props }: Props) => {
  const ref = useRef<HTMLDivElement>();
  const [isEditable, setIsEditable] = useState(false);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );
  const {
    children,
    data,
    triggers,
    repeatedIndex,
    dataPath,
    hideIfDataIsEmpty,
    ...componentProps
  } = component.props as any;

  const handleDoubleClick = (e: any) => {
    e.preventDefault();
    if (!isPreviewMode) {
      setIsEditable(true);
    }
  };

  const handleBlur = (e: any) => {
    e.preventDefault();
    if (!isPreviewMode) {
      setIsEditable(false);
      updateTreeComponent(component.id!, {
        children: ref.current?.innerText,
      });
    }
  };

  let value = isPreviewMode
    ? data?.value ?? hideIfDataIsEmpty
      ? ""
      : children
    : children;

  if (isPreviewMode && typeof repeatedIndex !== "undefined" && dataPath) {
    const path = dataPath.replaceAll("[0]", `[${repeatedIndex}]`);
    value = get(data?.base ?? {}, path) ?? hideIfDataIsEmpty ? "" : children;
  }

  return (
    <MantineText
      ref={ref}
      contentEditable={!isPreviewMode && isEditable}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      {...props}
      {...componentProps}
      {...triggers}
      suppressContentEditableWarning
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : value}
    </MantineText>
  );
};

export const Text = memo(TextComponent, isSame);
