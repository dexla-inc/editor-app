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

type Props = EditableComponentMapper & FileButtonProps;

export const FileButtonComponent = forwardRef(
  ({ component, onChange, shareableContent, ...props }: Props, ref) => {
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

    const { inputStyle } = useBrandingStyles();
    const customStyle = merge(inputStyle, style);

    return (
      <>
        <MantineFileButton
          onChange={(e) => {
            if (!isPreviewMode) return;
            onChange && onChange(e);
            triggers?.onChange && triggers.onChange?.(e);
          }}
          {...contentEditableProps}
          {...componentProps}
          style={customStyle}
          {...restProps}
          ref={ref}
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
