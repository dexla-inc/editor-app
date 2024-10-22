import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { DividerProps, Divider as MantineDivider } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & DividerProps;

const DividerComponent = forwardRef(
  ({ renderTree, shareableContent, component, ...props }: Props, ref) => {
    const { children, triggers, ...componentProps } = component.props as any;

    return (
      <MantineDivider
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        style={{ ...props.style, width: "100%" }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children?.toString()}
      </MantineDivider>
    );
  },
);
DividerComponent.displayName = "Divider";

export const Divider = memo(withComponentWrapper<Props>(DividerComponent));
