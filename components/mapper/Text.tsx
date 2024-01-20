import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useContentEditable } from "@/hooks/useContentEditable";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Text as MantineText, TextProps } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo, useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & TextProps;

const TextComponent = forwardRef(
  ({ renderTree, component, isPreviewMode, ...props }: Props, ref: any) => {
    const contentEditableProps = useContentEditable(component.id as string);
    const {
      children,
      data,
      triggers,
      repeatedIndex,
      dataPath,
      hideIfDataIsEmpty,
      variable,
      ...componentProps
    } = component.props as any;

    const { getSelectedVariable, handleValueUpdate } = useBindingPopover();
    const selectedVariable = getSelectedVariable(variable);

    useEffect(() => {
      if (selectedVariable?.defaultValue === children) return;
      handleValueUpdate(component.id as string, selectedVariable);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedVariable]);

    let value = isPreviewMode
      ? data?.value ?? (hideIfDataIsEmpty ? "" : children)
      : children;

    if (isPreviewMode && typeof repeatedIndex !== "undefined" && dataPath) {
      const path = dataPath.replaceAll("[0]", `[${repeatedIndex}]`);
      value =
        get(data?.base ?? {}, path) ?? (hideIfDataIsEmpty ? "" : children);
    }

    return (
      <MantineText
        {...contentEditableProps}
        {...props}
        {...componentProps}
        {...triggers}
        key={`${component.id}-${repeatedIndex}`}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : value}
      </MantineText>
    );
  },
);
TextComponent.displayName = "Text";

export const Text = memo(withComponentWrapper<Props>(TextComponent), isSame);
