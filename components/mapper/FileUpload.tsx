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
import { UploadMultipleResponse } from "@/requests/storage/types";
import { uploadFile } from "@/requests/storage/mutations";

type Props = EditableComponentMapper & DropzoneProps;

type FileValue = {
  url: string;
  extension: string;
  name: string;
  size: number;
};

const defaultFileProps = {
  url: "string",
  extension: "string",
  name: "string",
  size: 0,
};

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
  const projectId = useEditorTreeStore((state) => state.currentProjectId)!;

  const componentValue = component?.onLoad?.value ?? [defaultFileProps];

  const [, setValue] = useInputValue<FileValue | FileValue[]>(
    {
      value: componentValue,
    },
    props.id!,
  );

  const defaultTriggers = {
    onDrop: async (newValue: File | File[]) => {
      newValue = Array.isArray(newValue) ? newValue : [newValue];

      const response = (await uploadFile(
        projectId,
        newValue,
        true,
      )) as UploadMultipleResponse;

      const formattedValue = newValue.map((file, index) => ({
        url: response?.files[index]?.url,
        extension: file.name.split(".")?.at(-1) ?? "",
        name: file.name,
        size: file.size,
      }));

      setValue(formattedValue);
      onChange?.({ target: { files: formattedValue } });
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
