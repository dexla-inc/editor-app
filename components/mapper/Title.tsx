import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useData } from "@/hooks/useData";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { CSSObject, Title as MantineTitle, TitleProps } from "@mantine/core";
import { forwardRef, memo } from "react";

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

    const { triggers, variable, ...componentProps } = component.props as any;
    const { style, ...restProps } = props as any;

    const { getValue } = useData();
    const childrenValue = getValue("children", { component, shareableContent });

    return (
      <MantineTitle
        {...contentEditableProps}
        {...restProps}
        {...componentProps}
        {...triggers}
        ref={ref ?? contentEditableProps.ref}
        key={`${component.id}`}
        style={{
          ...style,
          ...(style?.fontSize ? { fontSize: style.fontSize + "px" } : {}),
        }}
      >
        {childrenValue}
      </MantineTitle>
    );
  },
);

TitleComponent.displayName = "Title";

export const Title = memo(withComponentWrapper<Props>(TitleComponent), isSame);
