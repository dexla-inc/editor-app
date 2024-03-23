import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useChangeState } from "@/hooks/useChangeState";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { NavigationAction } from "@/utils/actions";
import { getColorValue } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { NavLink as MantineNavLink, NavLinkProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";
type Props = EditableComponentMapper & NavLinkProps;

const NavLinkComponent = forwardRef(
  (
    { renderTree, component, shareableContent, isPreviewMode, ...props }: Props,
    ref,
  ) => {
    const theme = useThemeStore((state) => state.theme);
    const currentPageId = useEditorTreeStore((state) => state.currentPageId);
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );

    const activePageId = (
      component.actions?.find(
        (action) => action.action.name === "navigateToPage",
      )?.action as NavigationAction
    )?.pageId;
    const active = currentPageId === activePageId;

    const activeProps = {};
    if (active && isPreviewMode) {
      merge(activeProps, component?.states?.active);
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

    const labelValue = useComputeValue({
      componentId: component.id!,
      field: "label",
      shareableContent,
      staticFallback: component.props?.label,
    });

    const { color: textColor, backgroundColor } = useChangeState({
      bg,
      textColor: color,
      isTransparentBackground: true,
    });

    merge(componentProps, {
      style: { ...props.style, color: textColor, backgroundColor },
    });

    const hasNestedLinks =
      (component.children && component.children?.length > 0) ?? isNested;

    return (
      <MantineNavLink
        {...contentEditableProps}
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
        childrenOffset={hasNestedLinks ? 20 : 0}
        rightSection={hasNestedLinks ? <Icon name="IconChevronRight" /> : null}
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
      >
        {component.children &&
          component.children.length > 0 &&
          component.children?.map((child) => renderTree(child))}
      </MantineNavLink>
    );
  },
);
NavLinkComponent.displayName = "NavLink";

export const NavLink = memo(
  withComponentWrapper<Props>(NavLinkComponent),
  isSame,
);
