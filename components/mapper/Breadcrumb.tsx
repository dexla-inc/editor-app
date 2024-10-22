import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import {
  BreadcrumbsProps,
  Breadcrumbs as MantineBreadcrumbs,
} from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & BreadcrumbsProps;

const BreadcrumbComponent = forwardRef(
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
      <MantineBreadcrumbs
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
      >
        <ChildrenWrapper>
          {component.children && component.children.length > 0
            ? component.children?.map((child) =>
                renderTree(child, shareableContent),
              )
            : children?.toString()}
        </ChildrenWrapper>
      </MantineBreadcrumbs>
    );
  },
);
BreadcrumbComponent.displayName = "Breadcrumb";

export const Breadcrumb = memo(
  withComponentWrapper<Props>(BreadcrumbComponent),
);
