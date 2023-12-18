import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
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
    triggers,
    styles,
    ...componentProps
  } = component.props as any;
  const theme = useEditorStore((state) => state.theme);
  const borderColor = getColorFromTheme(theme, "Border.6");

  const customInputStyle = merge({}, { borderColor }, props.style);
  const customStyles = merge({}, styles, {
    input: customInputStyle,
  });

  return (
    <MantineDatePickerInput
      icon={iconName ? <Icon name={iconName} /> : null}
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
