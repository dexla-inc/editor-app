import { Icon as BaseIconComponent } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { MantineThemeExtended, useEditorStore } from "@/stores/editor";
import { globalStyles } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const getColorValue = (theme: MantineThemeExtended, value?: string) => {
  console.log(value);
  if (value == undefined) return "transparent";
  const [color, index] = value.split(".");

  const _value =
    value != "transparent"
      ? // @ts-ignore
        theme.colors[color][index]
      : value;

  return _value;
};

const IconComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, color, bg, triggers, size, ...componentProps } =
      component.props as any;

    const theme = useEditorStore((state) => state.theme);
    const width = globalStyles().sizing.icon[size];
    return (
      <BaseIconComponent
        {...props}
        {...triggers}
        {...componentProps}
        color={getColorValue(theme, color)}
        bg={getColorValue(theme, bg)}
        style={{ width: width, height: width }}
        ref={ref}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </BaseIconComponent>
    );
  },
);
IconComponent.displayName = "Icon";

export const Icon = memo(withComponentWrapper<Props>(IconComponent), isSame);
