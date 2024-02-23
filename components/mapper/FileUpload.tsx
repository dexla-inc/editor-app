import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Box } from "@mantine/core";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode?: Boolean;
} & DropzoneProps;

const FileUploadComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const { children, ...componentProps } = component.props as any;

  const otherProps = omit(props, ["children", "onDrop"]);
  const dragProps = isPreviewMode
    ? { dragEventsBubbling: false, activateOnDrag: true }
    : {};

  return (
    <Box {...otherProps}>
      <Dropzone {...props} {...dragProps} {...componentProps}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </Dropzone>
    </Box>
  );
};

export const FileUpload = memo(FileUploadComponent, isSame);
