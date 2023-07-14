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
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );
  const { children, ...componentProps } = component.props as any;

  const handleDoubleClick = (e: any) => {
    e.preventDefault();
    setIsEditable(true);
  };

  const handleBlur = (e: any) => {
    e.preventDefault();
    setIsEditable(false);
    updateTreeComponent(component.id!, {
      children: ref.current?.innerText,
    });
  };

  return (
    <MantineTitle
      ref={ref}
      contentEditable={isEditable}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      {...props}
      {...componentProps}
      suppressContentEditableWarning
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTitle>
  );
};
