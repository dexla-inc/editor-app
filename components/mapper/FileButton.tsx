import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import {
  Button,
  FileButtonProps,
  FileButton as MantineFileButton,
} from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FileButtonProps;

export const FileButton = ({
  renderTree,
  component,
  onChange,
  ...props
}: Props) => {
  const { name, triggers, ...componentProps } = component.props ?? {};
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  return (
    <>
      <MantineFileButton
        onChange={(e) => {
          if (!isPreviewMode) return;
          onChange && onChange(e);
          triggers?.onChange && triggers.onChange?.(e);
        }}
        {...componentProps}
        {...props}
      >
        {(props) => <Button {...props}>{name}</Button>}
      </MantineFileButton>
    </>
  );
};
