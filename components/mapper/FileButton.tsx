import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useContentEditable } from "@/hooks/useContentEditable";
import { Component } from "@/utils/editor";
import {
  Button,
  FileButtonProps,
  FileButton as MantineFileButton,
} from "@mantine/core";
import { useEffect } from "react";
import { useData } from "@/hooks/useData";

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
  const contentEditableProps = useContentEditable(component.id as string);
  const { getSelectedVariable, handleValueUpdate } = useBindingPopover();
  const selectedVariable = getSelectedVariable(variable);

  const { getValue } = useData();
  const nameValue = getValue("name", { component, shareableContent });

  useEffect(() => {
    if (selectedVariable?.defaultValue === nameValue) return;
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
        {(props) => <Button {...props}>{nameValue}</Button>}
      </MantineFileButton>
    </>
  );
};
