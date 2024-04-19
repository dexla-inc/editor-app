import { EditableComponentMapper } from "@/utils/editor";
import { Progress as MantineProgress, ProgressProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";

type Props = EditableComponentMapper & ProgressProps;

const ProgressComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    const { value } = useComputeValue({
      shareableContent,
      onLoad: component.onLoad,
    });

    return (
      <MantineProgress
        ref={ref}
        {...props}
        {...componentProps}
        value={Number(value)}
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

export const Progress = memo(withComponentWrapper<Props>(ProgressComponent));
