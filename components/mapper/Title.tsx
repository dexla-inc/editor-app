import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { EditableComponentMapper } from "@/utils/editor";
import { Title as MantineTitle, TitleProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo, useMemo } from "react";

type Props = EditableComponentMapper & TitleProps;

const TitleComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref: any) => {
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );

    const { triggers, variable, order, hideIfDataIsEmpty, ...componentProps } =
      component.props as any;
    const { children: childrenValue = component.props?.children } =
      component?.onLoad || {};
    const { style, ...restProps } = props as any;

    const tag = useMemo(() => orderToTag(order), [order]);

    const { titleStyle } = useBrandingStyles({ tag });
    const customStyle = useMemo(
      () => merge({}, style, titleStyle),
      [style, titleStyle],
    );

    return (
      <MantineTitle
        {...contentEditableProps}
        {...restProps}
        {...componentProps}
        {...triggers}
        ref={ref}
        key={`${component.id}`}
        style={customStyle}
        // style={{
        //   ...style,
        //   ...(style?.fontSize ? { fontSize: style.fontSize + "px" } : {}),
        // }}
      >
        {String(childrenValue)}
      </MantineTitle>
    );
  },
);

TitleComponent.displayName = "Title";

const orderToTag = (order: number) => {
  return {
    1: "H1",
    2: "H2",
    3: "H3",
    4: "H4",
    5: "H5",
    6: "H6",
  }[order];
};

export const Title = memo(withComponentWrapper<Props>(TitleComponent));
