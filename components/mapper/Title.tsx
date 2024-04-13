import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useContentEditable } from "@/hooks/useContentEditable";
import { EditableComponentMapper } from "@/utils/editor";
import { Title as MantineTitle, TitleProps } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & TitleProps;

const TitleComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref: any) => {
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );

    const { triggers, variable, ...componentProps } = component.props as any;
    const { children: childrenValue } = component?.onLoad || {};
    const { style, ...restProps } = props as any;

    return (
      <MantineTitle
        {...contentEditableProps}
        {...restProps}
        {...componentProps}
        {...triggers}
        ref={ref}
        key={`${component.id}`}
        style={{
          ...style,
          ...(style?.fontSize ? { fontSize: style.fontSize + "px" } : {}),
        }}
      >
        {String(childrenValue)}
      </MantineTitle>
    );
  },
);

TitleComponent.displayName = "Title";

export const Title = memo(withComponentWrapper<Props>(TitleComponent));
