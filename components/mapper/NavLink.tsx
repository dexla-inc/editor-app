import { Icon } from "@/components/Icon";
import { Component } from "@/utils/editor";
import { NavLink as MantineNavLink, NavLinkProps } from "@mantine/core";
import { useRouter } from "next/router";
import { isSame } from "@/utils/componentComparison";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & NavLinkProps;

const NavLinkComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, isNested, pageId, triggers, icon, ...componentProps } =
    component.props as any;

  const router = useRouter();
  const curentPageId = router.query.page as string;
  const active = curentPageId === pageId;

  return (
    <MantineNavLink
      icon={<Icon name={icon} />}
      rightSection={isNested ? <Icon name="IconChevronRight" /> : null}
      active={active}
      {...props}
      {...componentProps}
      {...triggers}
    />
  );
};

export const NavLink = memo(NavLinkComponent, isSame);
