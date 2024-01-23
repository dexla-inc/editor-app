import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import { useContentEditable } from "@/hooks/useContentEditable";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { CSSObject, Title as MantineTitle, TitleProps } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo, useEffect } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  style: CSSObject;
  isPreviewMode: boolean;
  shareableContent: any;
} & TitleProps;

const TitleComponent = forwardRef(
  (
    { renderTree, component, isPreviewMode, shareableContent, ...props }: Props,
    ref: any,
  ) => {
    const contentEditableProps = useContentEditable(component.id as string);

    const { children, data, triggers, dataType, variable, ...componentProps } =
      component.props as any;

    const { childrenKey } = component.onLoad ?? {};
    const childrenValue =
      dataType === "dynamic" ? shareableContent.data?.[childrenKey] : children;

      const { getSelectedVariable, handleValueUpdate } = useBindingPopover();
      const selectedVariable = getSelectedVariable(variable);

      useEffect(() => {
          if (selectedVariable?.defaultValue === children) return;
          handleValueUpdate(component.id as string, selectedVariable);
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [selectedVariable]);

    return (
      <MantineTitle
        {...contentEditableProps}
        {...props}
        {...componentProps}
        {...triggers}
        ref={ref}
        key={`${component.id}`}
      >
        {childrenValue}
      </MantineTitle>
    );
  },
);

TitleComponent.displayName = "Title";

export const Title = memo(withComponentWrapper<Props>(TitleComponent), isSame);
