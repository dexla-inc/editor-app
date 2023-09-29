import { Icon } from "@/components/Icon";
import { Component } from "@/utils/editor";
import { NavLink as MantineNavLink, NavLinkProps } from "@mantine/core";
import { useRouter } from "next/router";
import { isSame } from "@/utils/componentComparison";
import { memo } from "react";
import { useEditorStore } from "@/stores/editor";
import merge from "lodash.merge";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & NavLinkProps;

const NavLinkComponent = ({ renderTree, component, ...props }: Props) => {
  const theme = useEditorStore((state) => state.theme);

  const {
    children,
    isNested,
    pageId,
    triggers,
    icon,
    color = "",
    ...componentProps
  } = component.props as any;

  const [section, index] = color.split(".");
  const colorSection = theme.colors[section];
  const textColor = colorSection?.[index] ?? "#000";

  const router = useRouter();
  const currentPageId = router.query.page as string;
  const active = currentPageId === pageId;

  merge(componentProps, { style: { color: textColor } });

  return (
    <MantineNavLink
      icon={<Icon name={icon} size={20} />}
      rightSection={isNested ? <Icon name="IconChevronRight" /> : null}
      active={active}
      {...props}
      {...componentProps}
      {...triggers}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineNavLink>
  );
};

export const NavLink = memo(NavLinkComponent, isSame);
