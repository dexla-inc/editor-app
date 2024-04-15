import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Box } from "@mantine/core";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import merge from "lodash.merge";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { memo } from "react";

type Props = EditableComponentMapper & DropzoneProps;

const FileUploadComponent = ({
  renderTree,
  component,
  isPreviewMode,
  shareableContent,
  ...props
}: Props) => {
  const { children, ...componentProps } = component.props as any;
  const { dashedBorderStyle } = useBrandingStyles();

  const otherProps = omit(props, ["children", "onDrop"]);
  const dragProps = {
    dragEventsBubbling: false,
    activateOnDrag: true,
    activateOnClick: true,
  };
  const style = merge({}, dashedBorderStyle, props.style);

  return isPreviewMode ? (
    <Dropzone {...props} {...dragProps} {...componentProps} style={style}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </Dropzone>
  ) : (
    <Box {...otherProps} {...componentProps} style={style}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </Box>
  );
};

export const FileUpload = memo(FileUploadComponent, isSame);
