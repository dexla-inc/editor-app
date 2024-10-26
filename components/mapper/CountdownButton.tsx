import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { useThemeStore } from "@/stores/theme";
import { DISABLED_HOVER } from "@/utils/branding";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
import { splitValueAndUnit } from "@/utils/splitValueAndUnit";
import { ButtonProps, Button as MantineButton } from "@mantine/core";
import merge from "lodash.merge";
import {
  ReactElement,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & ButtonProps & ReactElement<"Button">;

const CountdownButtonComponent = forwardRef(
  (
    {
      component,
      style,
      shareableContent,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
    const {
      triggers,
      icon,
      iconPosition,
      loading,
      textColor,
      variable,
      ...componentProps
    } = component.props as any;
    const {
      children: childrenValue = component.props?.children,
      duration = component.props?.duration,
    } = component.onLoad;

    const durationUnitAndValue = splitValueAndUnit(duration);
    const durationValue = durationUnitAndValue ? durationUnitAndValue[0] : 30;
    const durationUnit = durationUnitAndValue
      ? durationUnitAndValue[1]
      : "seconds";

    const [count, setCount] = useState(durationValue);
    const timerId = useRef<NodeJS.Timeout | null>(null);

    const theme = useThemeStore((state) => state.theme);

    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
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

    const customStyle = merge(
      {},
      buttonStyle,
      style,
      {
        color: labelTextColor,
      },
      count > 0 ? component.states?.disabled : {},
    );

    const { sx, ...restProps } = props;

    useEffect(() => {
      if (count > 0 && timerId.current === null) {
        timerId.current = setInterval(() => {
          setCount((currentCount) => currentCount - 1);
        }, 1000);
      }

      return () => {
        if (timerId.current !== null) {
          clearInterval(timerId.current);
          timerId.current = null;
        }
      };
    }, [count]);

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
        {String(childrenValue)} {count > 0 ? ` ${count} ${durationUnit}` : ""}
        <ChildrenWrapper />
      </MantineButton>
    );
  },
);
CountdownButtonComponent.displayName = "Button";

export const CountdownButton = memo(
  withComponentWrapper<Props>(CountdownButtonComponent),
);
