import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { useQueryParamsMatch } from "@/hooks/components/useQueryParamsMatch";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import { NavigationAction } from "@/utils/actions";
import { getColorValue } from "@/utils/branding";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, NavLink as MantineNavLink, NavLinkProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useShallow } from "zustand/react/shallow";
type Props = EditableComponentMapper & NavLinkProps;

const NavLinkComponent = forwardRef(
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
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
    const theme = useThemeStore((state) => state.theme);
    const currentPageId = useEditorTreeStore((state) => state.currentPageId);
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );

    const navigateAction = component.actions?.find(
      (action) => action.action.name === "navigateToPage",
    )?.action as NavigationAction;
    const isQueryParamsMatch = useQueryParamsMatch(
      navigateAction?.queryStrings,
    );
    const activePageId = navigateAction?.pageId;
    const active = currentPageId === activePageId && isQueryParamsMatch;

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
    const { label: labelValue = componentProps.label } = component.onLoad;

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
      <Box unstyled style={props.style as any} {...props} {...triggers}>
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
          rightSection={
            hasNestedLinks ? <Icon name="IconChevronRight" /> : null
          }
          active={active}
          {...componentProps}
          label={String(labelValue)}
          styles={{
            ...(!icon && {
              icon: { marginRight: 0 },
            }),
            children: { paddingLeft: 0 },
            ...(icon &&
              !labelValue && {
                icon: { width: "100%", marginRight: 0 },
                children: { display: "none" },
              }),
            root: {
              gridArea: "1/1/-1/-1",
              padding: 0,
              "&:hover": {
                backgroundColor: "unset",
              },
            },
          }}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);
NavLinkComponent.displayName = "NavLink";

export const NavLink = memo(withComponentWrapper<Props>(NavLinkComponent));
