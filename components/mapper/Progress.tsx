import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, Progress as MantineProgress, ProgressProps } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & ProgressProps;

const ProgressComponent = forwardRef(
  (
    {
      renderTree,
      component,
      shareableContent,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const { children, triggers, ...componentProps } = component.props as any;

    const { value = 0 } = component.onLoad;

    return (
      <Box unstyled style={props.style as any} {...props} {...triggers}>
        <MantineProgress
          ref={ref}
          {...componentProps}
          value={Number(value)}
          styles={{
            root: {
              width: "100%",
              height: "100%",
              display: "flex",
              gridArea: "1 / 1 / -1 / -1",
            },
          }}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);
ProgressComponent.displayName = "Progress";

export const Progress = memo(withComponentWrapper<Props>(ProgressComponent));
