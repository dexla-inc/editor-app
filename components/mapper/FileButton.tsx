import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useEditorTreeStore } from "@/stores/editorTree";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Button,
  FileButtonProps,
  FileButton as MantineFileButton,
} from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";

import { uploadFileInternal } from "@/requests/storage/queries-noauth";
import { UploadMultipleResponse } from "@/requests/storage/types";

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
  (
    { component, shareableContent, grid: { ChildrenWrapper }, ...props }: Props,
    ref,
  ) => {
    const {
      triggers: { onClick, ...otherTriggers },
      variable,
      ...componentProps
    } = component.props ?? {};
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
      otherTriggers?.onChange?.({ target: { files: formattedValue } });
    };

    const onButtonClick =
      (props: any) => (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
          onClick?.(e, props.onClick);
        }
      };

    return (
      <>
        <MantineFileButton
          {...contentEditableProps}
          {...componentProps}
          style={customStyle}
          {...restProps}
          ref={ref}
          {...otherTriggers}
          onChange={handleChange}
        >
          {(props) => (
            <Button
              {...props}
              onClick={onButtonClick(props)}
              styles={{
                inner: {
                  display: "flex",
                  gridArea: "1 / 1 / -1 / -1",
                },
                label: {
                  display: "flex",
                  width: "100%",
                  height: "100%",
                },
              }}
            >
              {nameValue}
              <ChildrenWrapper />
            </Button>
          )}
        </MantineFileButton>
      </>
    );
  },
);
FileButtonComponent.displayName = "FileButton";

export const FileButton = memo(
  withComponentWrapper<Props>(FileButtonComponent),
);
