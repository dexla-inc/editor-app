import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useContentEditable } from "@/hooks/useContentEditable";
import { useEditorStore } from "@/stores/editor";
import { DISABLED_HOVER } from "@/utils/branding";
import { isSame } from "@/utils/componentComparison";
import {
  Component,
  getColorFromTheme,
  updateTreeComponentAttrs,
} from "@/utils/editor";
import { ButtonProps, Button as MantineCountdownButton } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import merge from "lodash.merge";
import { ReactElement, forwardRef, memo, useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
  shareableContent: any;
} & ButtonProps &
  ReactElement<"Button">;

const CountdownButtonComponent = forwardRef(
  (
    {
      renderTree,
      component,
      isPreviewMode,
      style,
      shareableContent,
      ...props
    }: Props,
    ref,
  ) => {
    const {
      triggers,
      loading,
      textColor,
      startingNumber,
      enabledText,
      children,
      ...componentProps
    } = component.props as any;

    const theme = useEditorStore((state) => state.theme);
    const editorTree = useEditorStore((state) => state.tree);
    const setTreeComponentCurrentState = useEditorStore(
      (state) => state.setTreeComponentCurrentState,
    );

    const updateState = (state: string) => {
      updateTreeComponentAttrs(editorTree.root, [component.id!], {
        onLoad: { currentState: { dataType: "static", static: state } },
      });
    };

    const [startingTime, setStartingTime] = useState(0);
    const [unit, setUnit] = useState("seconds");
    const [defaultContent, setDefaultContent] = useState<string | undefined>(
      undefined,
    );

    let childrenValue = children.replace(
      /{{startingNumber}}/g,
      `${startingTime} ${unit}`,
    );

    const handleTimer = () => {
      let [, time, unit] = startingNumber.match(/(\d+)([a-zA-Z]+)/);
      time = parseInt(time);
      setStartingTime(time);
      setUnit(unit);
    };

    useEffect(() => {
      // let [, time, unit] = startingNumber.match(/(\d+)([a-zA-Z]+)/);
      // time = parseInt(time);
      // setStartingTime(time);
      // setUnit(unit);
      handleTimer();
      updateState(isPreviewMode ? "disabled" : "default");
    }, [startingNumber, isPreviewMode]);

    const interval = useInterval(() => setStartingTime((s) => s - 1), 1000);

    useEffect(() => {
      if (isPreviewMode) {
        updateState("disabled");
        setDefaultContent(childrenValue);
        if (startingTime > 0) {
          interval.start();
        } else {
          interval.stop();
          updateState("default");
          setDefaultContent(enabledText);
        }
      } else {
        handleTimer();
        setDefaultContent(undefined);
      }
      return () => interval.stop();
    }, [isPreviewMode, startingTime, interval]);

    const contentEditableProps = useContentEditable(component.id as string);

    const defaultTriggers = isPreviewMode
      ? {}
      : {
          onClick: (e: any) => {
            e.preventDefault();
          },
        };

    const labelTextColor = getColorFromTheme(theme, textColor);
    const { buttonStyle } = useBrandingStyles();
    const customStyle = merge({}, buttonStyle, style, {
      color: labelTextColor,
    });

    const { sx, ...restProps } = props;

    return (
      <MantineCountdownButton
        {...contentEditableProps}
        loading={loading}
        {...defaultTriggers}
        {...restProps}
        {...(!isPreviewMode ? { sx: { ...sx } } : {})}
        {...componentProps}
        {...triggers}
        style={customStyle}
        styles={{ root: DISABLED_HOVER }}
        ref={ref ?? contentEditableProps.ref}
      >
        {defaultContent ?? childrenValue}
      </MantineCountdownButton>
    );
  },
);

CountdownButtonComponent.displayName = "CountdownButton";

export const CountdownButton = memo(
  withComponentWrapper<Props>(CountdownButtonComponent),
  isSame,
);
