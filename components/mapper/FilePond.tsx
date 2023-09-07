import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & DropzoneProps;

const FilePondComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, ...componentProps } = component.props as any;

  return (
    <Dropzone {...props} {...componentProps}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </Dropzone>
  );
};

export const FilePond = memo(FilePondComponent, isSame);
