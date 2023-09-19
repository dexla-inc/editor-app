import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  FileButtonProps,
  FileButton as MantineFileButton,
} from "@mantine/core";
import { memo, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & FileButtonProps;

const MantineFileButtonComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const { triggers, loading, ...componentProps } = component.props as any;

  const [files, setFiles] = useState<File[]>([]);

  const defaultTriggers = isPreviewMode
    ? {}
    : {
        onChange: (e: any) => {
          e.preventDefault();
        },
      };

  return (
    <MantineFileButton
      {...defaultTriggers}
      {...props}
      {...componentProps}
      {...triggers}
    ></MantineFileButton>
  );
};

export const FileButton = memo(MantineFileButtonComponent, isSame);
