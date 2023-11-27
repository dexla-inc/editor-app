import { Icon } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { DateInputProps, DateInput as MantineDateInput } from "@mantine/dates";
import merge from "lodash.merge";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & DateInputProps;

const DateInputComponent = ({ renderTree, component, ...props }: Props) => {
  const {
    children,
    isDisabled,
    disabled,
    icon: iconName,
    ...componentProps
  } = component.props as any;

  const customStyles = merge({}, props.styles, { label: { width: "100%" } });

  return (
    <MantineDateInput
      icon={iconName ? <Icon name={iconName} /> : null}
      disabled={isDisabled ? true : false}
      styles={customStyles}
      {...props}
      {...componentProps}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineDateInput>
  );
};

export const DateInput = memo(DateInputComponent, isSame);
