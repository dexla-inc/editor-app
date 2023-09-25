import { Component } from "@/utils/editor";
import {
  FileButton as MantineFileButton,
  FileButtonProps,
  Button,
} from "@mantine/core";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FileButtonProps;

export const FileButton = ({ renderTree, component, ...props }: Props) => {
  const { name, accept, triggers, disabled, ...componentProps } =
    component.props ?? {};
  console.log(component);
  return (
    <>
      <MantineFileButton
        {...triggers}
        accept={accept}
        disabled={disabled}
        {...componentProps}
        {...props}
      >
        {(props) => <Button {...props}>{name}</Button>}
      </MantineFileButton>
    </>
  );
};
