import { Icon } from "@/components/Icon";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import {
  DatePickerInputProps,
  DatePickerInput as MantineDatePickerInput,
} from "@mantine/dates";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { memo } from "react";

type Props = EditableComponentMapper & DatePickerInputProps;

const DateInputComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const {
    children,
    icon: iconName,
    iconPosition,
    triggers,
    styles,
    ...componentProps
  } = component.props as any;
  const { borderStyle, inputStyle } = useBrandingStyles();

  const customStyle = merge({}, borderStyle, inputStyle, props.style);

  const isPositionLeft =
    !iconPosition || (iconPosition && iconPosition === "left");

  return (
    <MantineDatePickerInput
      {...(iconName && isPositionLeft && { icon: <Icon name={iconName} /> })}
      {...(iconName &&
        !isPositionLeft && { rightSection: <Icon name={iconName} /> })}
      {...props}
      {...componentProps}
      {...triggers}
      style={{}}
      styles={{
        root: {
          position: "relative",
          ...pick(customStyle, ["display", "width", "minHeight", "minWidth"]),
          height: "fit-content",
        },
        input: customStyle,
      }}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children?.toString()}
    </MantineDatePickerInput>
  );
};

export const DateInput = memo(DateInputComponent, isSame);
