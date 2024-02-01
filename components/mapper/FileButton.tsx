import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useContentEditable } from "@/hooks/useContentEditable";
import { Component } from "@/utils/editor";
import {
  Button,
  FileButtonProps,
  FileButton as MantineFileButton,
} from "@mantine/core";
import merge from "lodash.merge";
import { useDataContext } from "@/contexts/DataProvider";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
  shareableContent: any;
} & FileButtonProps;

export const FileButton = ({
  renderTree,
  component,
  onChange,
  isPreviewMode,
  shareableContent,
  ...props
}: Props) => {
  const { triggers, variable, ...componentProps } = component.props ?? {};
  const { style, ...restProps } = props as any;
  const contentEditableProps = useContentEditable(component.id as string);

  const { computeValue } = useDataContext()!;
  const nameValue =
    computeValue({
      value: component.onLoad.name,
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
      >
        {(props) => <Button {...props}>{nameValue}</Button>}
      </MantineFileButton>
    </>
  );
};
