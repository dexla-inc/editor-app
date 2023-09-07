import { Icon } from "@/components/Icon";
import { Component } from "@/utils/editor";
import { NavLink as MantineNavLink, NavLinkProps } from "@mantine/core";
import { useRouter } from "next/router";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & NavLinkProps;

export const NavLink = ({ renderTree, component, ...props }: Props) => {
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
