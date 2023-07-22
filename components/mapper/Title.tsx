import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { Title as MantineTitle, TitleProps } from "@mantine/core";
import { useRef, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TitleProps;

export const Title = ({ renderTree, component, ...props }: Props) => {
  const ref = useRef<HTMLDivElement>();
  const [isEditable, setIsEditable] = useState(false);
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );
  const { children, data, ...componentProps } = component.props as any;

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

  const value = isPreviewMode ? data?.value ?? children : children;

  return (
    <MantineTitle
      ref={ref}
      contentEditable={!isPreviewMode && isEditable}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      {...props}
      {...componentProps}
      suppressContentEditableWarning
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : value}
    </MantineTitle>
  );
};
