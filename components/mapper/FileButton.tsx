import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Button,
  FileButtonProps,
  FileButton as MantineFileButton,
} from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { useInputValue } from "@/hooks/components/useInputValue";

import { UploadMultipleResponse } from "@/requests/storage/types";
import { uploadFileInternal } from "@/requests/storage/queries-noauth";

type Props = EditableComponentMapper & FileButtonProps;

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

export const FileButtonComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
    const { triggers, variable, ...componentProps } = component.props ?? {};
    const { style, ...restProps } = props as any;
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );
    const { name: nameValue } = component.onLoad;
    const projectId = useEditorTreeStore((state) => state.currentProjectId)!;

    const { inputStyle } = useBrandingStyles();
    const customStyle = merge(inputStyle, style);

    const componentValue = component?.onLoad?.value ?? [defaultFileProps];

    const [, setValue] = useInputValue<FileValue | FileValue[]>(
      {
        value: componentValue,
      },
      props.id!,
    );

    const handleChange = async (newValue: File | File[]) => {
      if (!isPreviewMode) return;
      newValue = Array.isArray(newValue) ? newValue : [newValue];

      const response = (await uploadFileInternal(
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
      triggers?.onChange?.({ target: { files: formattedValue } });
    };

    return (
      <>
        <MantineFileButton
          {...contentEditableProps}
          {...componentProps}
          style={customStyle}
          {...restProps}
          ref={ref}
          {...triggers}
          onChange={handleChange}
        >
          {(props) => <Button {...props}>{nameValue}</Button>}
        </MantineFileButton>
      </>
    );
  },
);
FileButtonComponent.displayName = "FileButton";

export const FileButton = memo(
  withComponentWrapper<Props>(FileButtonComponent),
);
