import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { DividerProps, Divider as MantineDivider } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & DividerProps;

const DividerComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    return (
      <MantineDivider
        ref={ref}
        {...props}
        {...componentProps}
        style={{ ...props.style, width: "100%" }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children?.toString()}
      </MantineDivider>
    );
  },
);
DividerComponent.displayName = "Divider";

export const Divider = memo(
  withComponentWrapper<Props>(DividerComponent),
  isSame,
);
