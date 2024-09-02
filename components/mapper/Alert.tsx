import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useThemeStore } from "@/stores/theme";
import { EditableComponentMapper } from "@/utils/editor";
import { AlertProps, Alert as MantineAlert } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & Omit<AlertProps, "title">;

const AlertComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props, ref) => {
    const { icon, iconColor, triggers, ...componentProps } =
      component.props as any;
    const { children: childrenValue } = component?.onLoad;
    const theme = useThemeStore((state) => state.theme);
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
        style={{ ...props.style }}
        {...triggers}
        styles={{
          icon: {
            margin: "0px",
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "1 / 2",
            gridRow: "1 / 4",
            width: "auto",
            height: "auto",
            "*": {
              display: "grid !important",
              gridTemplateColumns: "subgrid",
              gridTemplateRows: "subgrid",
              gridColumn: "1 / -1",
              gridRow: "1 / -1",
            },
          },
          wrapper: {
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "1 / -1",
            gridRow: "1 / -1",
          },
          body: {
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "2 / -1",
            gridRow: "1 / -1",
          },
          message: {
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "1 / -1",
            gridRow: "1 / -1",
          },
        }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : childrenValue?.toString()}
      </MantineAlert>
    );
  },
);
AlertComponent.displayName = "Alert";

export const Alert = memo(withComponentWrapper<Props>(AlertComponent));
