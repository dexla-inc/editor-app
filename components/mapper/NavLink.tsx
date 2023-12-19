import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { NavigationAction } from "@/utils/actions";
import { getColorValue } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { NavLink as MantineNavLink, NavLinkProps } from "@mantine/core";
import merge from "lodash.merge";
import { useRouter } from "next/router";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & NavLinkProps;

const NavLinkComponent = ({ renderTree, component, ...props }: Props) => {
  const theme = useEditorStore((state) => state.theme);

  const router = useRouter();
  const currentPageId = router.query.page as string;
  const activePageId = (
    component.actions?.find((action) => action.action.name === "navigateToPage")
      ?.action as NavigationAction
  )?.pageId;
  const active = currentPageId === activePageId;

  const activeProps = {};
  if (active) {
    merge(activeProps, component?.states?.Active);
  }

  const {
    children,
    isNested,
    pageId,
    triggers,
    icon,
    color = "",
    iconColor = "",
    bg = "",
    ...componentProps
  } = merge({}, component.props, activeProps) as any;

  const textColor = getColorFromTheme(theme, color) ?? "#000";
  const backgroundColor = getColorFromTheme(theme, bg) ?? "transparent";

  merge(componentProps, {
    style: { ...props.style, color: textColor, backgroundColor },
  });

  return (
    <MantineNavLink
      {...(icon && {
        icon: (
          <Icon
            name={icon}
            size={20}
            {...(iconColor ? { color: getColorValue(theme, iconColor) } : null)}
          />
        ),
      })}
      childrenOffset={isNested ? 20 : 0}
      rightSection={isNested ? <Icon name="IconChevronRight" /> : null}
      active={active}
      {...props}
      {...componentProps}
      {...triggers}
      styles={{
        ...(!icon && {
          icon: { marginRight: 0 },
        }),
        children: { paddingLeft: 0 },
        root: {
          padding: 0,
          "&:hover": {
            backgroundColor: "unset",
          },
        },
      }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineNavLink>
  );
};

export const NavLink = memo(NavLinkComponent, isSame);
