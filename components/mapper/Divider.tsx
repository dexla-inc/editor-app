import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { DividerProps, Divider as MantineDivider, Box } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & DividerProps;

const DividerComponent = forwardRef(
  (
    {
      renderTree,
      shareableContent,
      component,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const { children, triggers, ...componentProps } = component.props as any;

    return (
      <Box style={props.style}>
        <MantineDivider
          ref={ref}
          {...props}
          {...componentProps}
          {...triggers}
          style={{
            ...props.style,
            width: "100%",
            height: "100%",
            display: "flex",
            gridArea: "1 / 1 / -1 / -1",
          }}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);
DividerComponent.displayName = "Divider";

export const Divider = memo(withComponentWrapper<Props>(DividerComponent));
