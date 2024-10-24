import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import { EditableComponentMapper } from "@/utils/editor";
import { AlertProps, Alert as MantineAlert } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & Omit<AlertProps, "title">;

const AlertComponent = forwardRef(
  (
    {
      renderTree,
      shareableContent,
      component,
      grid: { ChildrenWrapper, isGridCss },
      ...props
    }: Props,
    ref,
  ) => {
    const { icon, iconColor, color, triggers, ...componentProps } =
      component.props as any;
    const { children: childrenValue } = component?.onLoad;
    const theme = useThemeStore((state) => state.theme);
    const colorHex = get(theme.colors, color);
    const iconColorHex = get(theme.colors, iconColor);

    return (
      <MantineAlert
        ref={ref}
        {...(icon && {
          icon: (
            <Icon
              name={icon}
              // @ts-ignore
              color={iconColorHex}
            />
          ),
        })}
        {...props}
        {...componentProps}
        {...triggers}
        style={{ ...props.style }}
        styles={{
          root: {
            backgroundColor: colorHex,
          },
          ...(isGridCss && mantineStyles),
        }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : childrenValue?.toString()}
        <ChildrenWrapper />
      </MantineAlert>
    );
  },
);
AlertComponent.displayName = "Alert";

const commonGridStyle = {
  display: "grid",
  gridTemplateColumns: "subgrid",
  gridTemplateRows: "subgrid",
  gridArea: "1 / 1 / -1 / -1",
};

const mantineStyles = {
  wrapper: commonGridStyle,
  icon: {
    margin: "0px",
  },
  body: commonGridStyle,
  message: commonGridStyle,
};

export const Alert = memo(withComponentWrapper<Props>(AlertComponent));
