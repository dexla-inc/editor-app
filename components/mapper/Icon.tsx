import { Icon as BaseIconComponent } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import { getColorValue, globalStyles } from "@/utils/branding";
import { EditableComponentMapper } from "@/utils/editor";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
type Props = EditableComponentMapper;

const IconComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { children, color, bg, triggers, size, ...componentProps } =
      component.props as any;

    const theme = useThemeStore((state) => state.theme);
    const width = globalStyles().sizing.icon[size];
    return (
      <BaseIconComponent
        {...props}
        {...triggers}
        {...componentProps}
        bg={getColorValue(theme, bg)}
        style={merge({}, props.style, {
          width,
          height: width,
          color: getColorValue(theme, color),
        })}
        ref={ref}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children?.toString()}
      </BaseIconComponent>
    );
  },
);
IconComponent.displayName = "Icon";

export const Icon = memo(withComponentWrapper<Props>(IconComponent));
