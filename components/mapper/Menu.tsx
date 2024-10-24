import { EditableComponentMapper } from "@/utils/editor";
import { Menu as MantineMenu, MenuProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & MenuProps;

const MenuComponent = forwardRef(
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
    const { children, ...componentProps } = component.props as any;

    return (
      <MantineMenu ref={ref} {...props} {...componentProps}>
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children}
        <ChildrenWrapper />
      </MantineMenu>
    );
  },
);
MenuComponent.displayName = "Menu";

export const Menu = memo(withComponentWrapper<Props>(MenuComponent));
