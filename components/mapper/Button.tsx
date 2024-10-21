import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { useThemeStore } from "@/stores/theme";
import { DISABLED_HOVER } from "@/utils/branding";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import merge from "lodash.merge";
import { ReactElement, forwardRef, memo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & ButtonProps & ReactElement<"Button">;

const ButtonComponent = forwardRef(
  (
    { component, style, shareableContent, ChildrenWrapper, ...props }: Props,
    ref,
  ) => {
    const {
      triggers,
      icon,
      iconPosition,
      loading,
      textColor,
      variable,
      color,
      ...componentProps
    } = component.props as any;
    const { children: childrenValue = component.props?.children } =
      component.onLoad;

    const theme = useThemeStore((state) => state.theme);

    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );

    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );

    const defaultTriggers = isPreviewMode
      ? {}
      : {
          onClick: (e: any) => {
            e.preventDefault();
          },
        };

    const labelTextColor = getColorFromTheme(theme, textColor);

    const { buttonStyle } = useBrandingStyles();

    const { color: backgroundColor } = useChangeState({
      bg: textColor,
      textColor: color,
    });

    const customStyle = merge({}, buttonStyle, style, {
      color: labelTextColor,
      backgroundColor,
    });

    const { sx, ...restProps } = props;

    return (
      <MantineButton
        {...contentEditableProps}
        {...(icon &&
          iconPosition === "left" && { leftIcon: <Icon name={icon} /> })}
        {...(icon &&
          iconPosition === "right" && { rightIcon: <Icon name={icon} /> })}
        loading={loading}
        {...defaultTriggers}
        {...restProps}
        {...(!isPreviewMode ? { sx: { ...sx } } : {})}
        {...componentProps}
        {...triggers}
        style={customStyle}
        styles={{
          root: DISABLED_HOVER,
          inner: {
            display: "flex",
            gridArea: "1 / 1 / -1 / -1",
          },
          label: {
            display: "flex",
            width: "100%",
            height: "100%",
          },
        }}
        ref={ref}
      >
        <ChildrenWrapper>{String(childrenValue)}</ChildrenWrapper>
      </MantineButton>
    );
  },
);
ButtonComponent.displayName = "Button";

export const Button = memo(withComponentWrapper<Props>(ButtonComponent));
