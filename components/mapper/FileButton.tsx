import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useContentEditable } from "@/hooks/useContentEditable";
import { Component } from "@/utils/editor";
import {
  Button,
  FileButtonProps,
  FileButton as MantineFileButton,
} from "@mantine/core";
import { useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & FileButtonProps;

export const FileButton = ({
  renderTree,
  component,
  onChange,
  ...props
}: Props) => {
  const { name, triggers, isPreviewMode, variable, ...componentProps } =
    component.props ?? {};
  const contentEditableProps = useContentEditable(component.id as string);
  const { getSelectedVariable, handleValueUpdate } = useBindingPopover();
  const selectedVariable = getSelectedVariable(variable);

  useEffect(() => {
    if (selectedVariable?.defaultValue === name) return;
    handleValueUpdate(component.id as string, selectedVariable, "name");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariable]);

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
        {...props}
      >
        {(props) => <Button {...props}>{name}</Button>}
      </MantineFileButton>
    </>
  );
};
