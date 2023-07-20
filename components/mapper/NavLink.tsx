import { Component } from "@/utils/editor";
import { NavLink as MantineNavLink, NavLinkProps } from "@mantine/core";
import { IconChevronRight, IconHome } from "@tabler/icons-react";
import { useRouter } from "next/router";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & NavLinkProps;

export const NavLink = ({ renderTree, component, ...props }: Props) => {
  const { children, isNested, pageId, ...componentProps } =
    component.props as any;

  const router = useRouter();
  const curentPageId = router.query.page as string;
  const active = curentPageId === pageId;

  return (
    <MantineNavLink
      icon={<IconHome size="1rem" stroke={1.5} />}
      rightSection={
        isNested ? <IconChevronRight size="0.8rem" stroke={1.5} /> : null
      }
      active={active}
      variant={active ? "filled" : "light"}
      {...props}
      {...componentProps}
    />
  );
};
