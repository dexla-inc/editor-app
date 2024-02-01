import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useChangeState } from "@/hooks/useChangeState";
import { useEditorStore } from "@/stores/editor";
import { NavigationAction } from "@/utils/actions";
import { getColorValue } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { NavLink as MantineNavLink, NavLinkProps } from "@mantine/core";
import merge from "lodash.merge";
import { useRouter } from "next/router";
import { forwardRef, memo } from "react";
import { useDataContext } from "@/contexts/DataProvider";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  shareableContent: any;
} & NavLinkProps;

const NavLinkComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const theme = useEditorStore((state) => state.theme);

    const router = useRouter();
    const currentPageId = router.query.page as string;
    const activePageId = (
      component.actions?.find(
        (action) => action.action.name === "navigateToPage",
      )?.action as NavigationAction
    )?.pageId;
    const active = currentPageId === activePageId;

    const activeProps = {};
    if (active) {
      merge(activeProps, component?.states?.Active);
    }

    const {
      isNested,
      pageId,
      triggers,
      icon,
      color = "",
      iconColor = "",
      bg = "",
      variable,
      ...componentProps
    } = merge({}, component.props, activeProps) as any;

    const { computeValue } = useDataContext()!;
    const labelValue =
      computeValue({
        value: component.onLoad.label,
        shareableContent,
      }) ?? component.props?.label;

    const { color: textColor, backgroundColor } = useChangeState({
      bg,
      textColor: color,
      isTransparentBackground: true,
    });

    merge(componentProps, {
      style: { ...props.style, color: textColor, backgroundColor },
    });

    return (
      <MantineNavLink
        ref={ref}
        {...(icon && {
          icon: (
            <Icon
              name={icon}
              size={20}
              {...(iconColor
                ? { color: getColorValue(theme, iconColor) }
                : null)}
            />
          ),
        })}
        childrenOffset={isNested ? 20 : 0}
        rightSection={isNested ? <Icon name="IconChevronRight" /> : null}
        active={active}
        {...props}
        {...componentProps}
        {...triggers}
        label={labelValue}
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
      />
    );
  },
);
NavLinkComponent.displayName = "NavLink";

export const NavLink = memo(
  withComponentWrapper<Props>(NavLinkComponent),
  isSame,
);
