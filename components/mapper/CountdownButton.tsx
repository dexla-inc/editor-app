import { Icon } from "@/components/Icon";
import { useDataContext } from "@/contexts/DataProvider";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useThemeStore } from "@/stores/theme";
import { DISABLED_HOVER } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
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
import { memoize } from "proxy-memoize";

type Props = EditableComponentMapper & ButtonProps & ReactElement<"Button">;

const CountdownButtonComponent = forwardRef(
  (
    { component, isPreviewMode, style, shareableContent, ...props }: Props,
    ref,
  ) => {
    const {
      triggers,
      icon,
      iconPosition,
      loading,
      textColor,
      variable,
      duration,
      ...componentProps
    } = component.props as any;

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

    const { computeValue } = useDataContext()!;
    const onLoad = useEditorTreeStore(
      memoize((state) => state.componentMutableAttrs[component?.id!].onLoad),
    );
    const childrenValue = computeValue({
      value: onLoad?.children,
      shareableContent,
      staticFallback: component.props?.children,
    });

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
      count > 0 ?? component.states?.disabled,
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
        styles={{ root: DISABLED_HOVER }}
        ref={ref}
      >
        {childrenValue} {count > 0 ? ` in ${count} ${durationUnit}` : ""}
      </MantineButton>
    );
  },
);
CountdownButtonComponent.displayName = "Button";

export const CountdownButton = memo(
  withComponentWrapper<Props>(CountdownButtonComponent),
  isSame,
);
