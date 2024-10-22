import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Progress as MantineProgress, ProgressProps } from "@mantine/core";
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
      <MantineProgress
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        value={Number(value)}
        style={{ ...props.style }}
      >
        <ChildrenWrapper>
          {component.children && component.children.length > 0
            ? component.children?.map((child) =>
                renderTree(child, shareableContent),
              )
            : children}
        </ChildrenWrapper>
      </MantineProgress>
    );
  },
);
ProgressComponent.displayName = "Progress";

export const Progress = memo(withComponentWrapper<Props>(ProgressComponent));
