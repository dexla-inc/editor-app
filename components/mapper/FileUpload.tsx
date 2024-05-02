import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { EditableComponentMapper } from "@/utils/editor";
import { Box } from "@mantine/core";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import merge from "lodash.merge";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { memo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useInputValue } from "@/hooks/components/useInputValue";

type Props = EditableComponentMapper & DropzoneProps;

const FileUploadComponent = ({
  renderTree,
  component,
  shareableContent,
  ...props
}: Props) => {
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );
  const { children, triggers, ...componentProps } = component.props as any;
  const { dashedBorderStyle } = useBrandingStyles();
  const { onChange, ...otherTriggers } = triggers || {};

  const [value, setValue] = useInputValue<File>(
    {
      value: component?.onLoad?.value,
    },
    props.id!,
  );

  const defaultTriggers = {
    onChange: (val: File) => {
      setValue(val);
      onChange && onChange({ target: { value: val } });
    },
  };

  const otherProps = omit(props, ["children", "onDrop"]);
  const dragProps = {
    dragEventsBubbling: false,
    activateOnDrag: true,
    activateOnClick: true,
  };
  const style = merge({}, dashedBorderStyle, props.style);

  return isPreviewMode ? (
    <Dropzone
      {...props}
      {...dragProps}
      {...componentProps}
      {...otherTriggers}
      {...defaultTriggers}
      onChange={console.log}
      style={style}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) =>
            renderTree(child, shareableContent),
          )
        : children}
    </Dropzone>
  ) : (
    <Box {...otherProps} {...otherTriggers} {...componentProps} style={style}>
      {component.children && component.children.length > 0
        ? component.children?.map((child) =>
            renderTree(child, shareableContent),
          )
        : children}
    </Box>
  );
};

export const FileUpload = memo(withComponentWrapper(FileUploadComponent));
