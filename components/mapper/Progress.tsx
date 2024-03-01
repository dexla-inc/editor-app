import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Progress as MantineProgress, ProgressProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & ProgressProps;

const ProgressComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    return (
      <MantineProgress
        ref={ref}
        {...props}
        {...componentProps}
        style={{ ...props.style }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children}
      </MantineProgress>
    );
  },
);
ProgressComponent.displayName = "Progress";

export const Progress = memo(
  withComponentWrapper<Props>(ProgressComponent),
  isSame,
);
