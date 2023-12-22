import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Group, Radio as MantineRadio, RadioGroupProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo, useState } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode?: boolean;
} & RadioGroupProps;

const RadioComponent = forwardRef(
  ({ renderTree, component, isPreviewMode, ...props }: Props, ref) => {
    const { children, value, triggers, styles, ...componentProps } =
      component.props as any;

    const [_value, setValue] = useState(value);
    const defaultStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };

    const { onChange, ...otherTriggers } = triggers;

    const defaultTriggers = isPreviewMode
      ? {
          onChange: (val: string) => {
            setValue(val);
            onChange && onChange(val);
          },
        }
      : {
          onChange: () => {
            setValue(undefined);
          },
        };

    return (
      <MantineRadio.Group
        ref={ref}
        styles={merge({ label: { width: "100%" } }, styles)}
        {...props}
        style={{
          ...(props.style ?? {}),
          ...defaultStyle,
        }}
        {...defaultTriggers}
        {...componentProps}
        {...otherTriggers}
        value={value}
        label={undefined}
      >
        <Group mt="xs">
          {component.children && component.children.length > 0
            ? component.children?.map((child) =>
                renderTree({
                  ...child,
                  props: {
                    ...child.props,
                    isInsideGroup: isPreviewMode,
                    checked: isPreviewMode
                      ? child?.props?.value?.toString() === _value?.toString()
                      : false,
                    triggers: {
                      onChange: (val: string) => {
                        setValue(val);
                      },
                    },
                  },
                }),
              )
            : children}
        </Group>
      </MantineRadio.Group>
    );
  },
);
RadioComponent.displayName = "Radio";

export const Radio = memo(withComponentWrapper<Props>(RadioComponent), isSame);
