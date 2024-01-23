import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useContentEditable } from "@/hooks/useContentEditable";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Text as MantineText, TextProps } from "@mantine/core";
import { forwardRef, memo, useEffect } from "react";
import get from "lodash.get";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
  shareableContent?: any;
} & TextProps;

const TextComponent = forwardRef(
  ({ renderTree, component, isPreviewMode, ...props }: Props, ref: any) => {
    const contentEditableProps = useContentEditable(component.id as string);
    const {
      children,
      triggers,
      hideIfDataIsEmpty,
      dataType,
        variable,
      ...componentProps
    } = component.props as any;

    const { childrenKey } = component.onLoad ?? {};

      const { getSelectedVariable, handleValueUpdate } = useBindingPopover();
      const selectedVariable = getSelectedVariable(variable);

      useEffect(() => {
          if (selectedVariable?.defaultValue === children) return;
          handleValueUpdate(component.id as string, selectedVariable);
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [selectedVariable]);

    return (
      <MantineText
        {...contentEditableProps}
        {...props}
        {...componentProps}
        {...triggers}
        ref={ref}
      >
        {!hideIfDataIsEmpty &&
          (props.shareableContent.data?.[childrenKey] ?? children)}
      </MantineText>
    );
  },
);
TextComponent.displayName = "Text";

export const Text = memo(withComponentWrapper<Props>(TextComponent), isSame);
