import { useDataContext } from "@/contexts/DataProvider";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useContentEditable } from "@/hooks/useContentEditable";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Button,
  FileButtonProps,
  FileButton as MantineFileButton,
} from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { isSame } from "@/utils/componentComparison";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & FileButtonProps;

export const FileButtonComponent = forwardRef(
  (
    { component, onChange, isPreviewMode, shareableContent, ...props }: Props,
    ref,
  ) => {
    const { triggers, variable, ...componentProps } = component.props ?? {};
    const { style, ...restProps } = props as any;
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );

    const { computeValue } = useDataContext()!;
    const nameValue =
      computeValue({
        value: component.onLoad?.name,
        shareableContent,
      }) ?? component.props?.name;

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
  isSame,
);
