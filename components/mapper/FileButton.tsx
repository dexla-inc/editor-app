import { useContentEditable } from "@/hooks/useContentEditable";
import { Component } from "@/utils/editor";
import {
  Button,
  FileButtonProps,
  FileButton as MantineFileButton,
} from "@mantine/core";

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
  const { name, triggers, isPreviewMode, ...componentProps } =
    component.props ?? {};
  const contentEditableProps = useContentEditable(component.id as string);

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
