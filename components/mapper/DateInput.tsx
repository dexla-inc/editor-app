import { Icon } from "@/components/Icon";
import { useDefaultBorderStyle } from "@/hooks/useDefaultBorderStyle";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  DatePickerInputProps,
  DatePickerInput as MantineDatePickerInput,
} from "@mantine/dates";
import merge from "lodash.merge";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode?: boolean;
} & DatePickerInputProps;

const DateInputComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const {
    children,
    isDisabled,
    disabled,
    icon: iconName,
    iconPosition,
    triggers,
    styles,
    ...componentProps
  } = component.props as any;
  const { borderStyle } = useDefaultBorderStyle();
  const customInputStyle = merge({}, borderStyle, props.style);
  const customStyles = merge({}, styles, {
    input: customInputStyle,
  });

  const isPositionLeft =
    !iconPosition || (iconPosition && iconPosition === "left");

  return (
    <MantineDatePickerInput
      {...(iconName && isPositionLeft && { icon: <Icon name={iconName} /> })}
      {...(iconName &&
        !isPositionLeft && { rightSection: <Icon name={iconName} /> })}
      disabled={isDisabled ? true : false}
      styles={customStyles}
      {...props}
      {...componentProps}
      {...triggers}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineDatePickerInput>
  );
};

export const DateInput = memo(DateInputComponent, isSame);
