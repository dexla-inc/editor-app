import { Component } from "@/utils/editor";
import { Text as MantineText, TextProps } from "@mantine/core";
import { useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextProps;

export const Text = ({ renderTree, component, ...props }: Props) => {
  const [isEditable, setIsEditable] = useState(false);
  const { children, ...componentProps } = component.props as any;

  const handleDoubleClick = (e: any) => {
    e.preventDefault();
    setIsEditable(true);
  };

  const handleBlur = (e: any) => {
    e.preventDefault();
    setIsEditable(false);
  };

  return (
    <MantineText
      contentEditable={isEditable}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      {...props}
      {...componentProps}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineText>
  );
};
