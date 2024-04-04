import { Icon } from "@/components/Icon";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useThemeStore } from "@/stores/theme";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper, getColorFromTheme } from "@/utils/editor";
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
  shareableContent,
  ...props
}: Props) => {
  const {
    children,
    icon: iconName,
    iconPosition,
    triggers,
    styles,
    color,
    ...componentProps
  } = component.props as any;
  const { borderStyle, inputStyle } = useBrandingStyles();
  const theme = useThemeStore((state) => state.theme);

  const customStyle = merge({}, borderStyle, inputStyle, props.style);
  const isPositionLeft =
    !iconPosition || (iconPosition && iconPosition === "left");
  const textColor = getColorFromTheme(theme, color);

  return (
    <>
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
          input: { ...customStyle, color: textColor },
          icon: {
            color: textColor,
          },
        }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children?.toString()}
      </MantineDatePickerInput>
    </>
  );
};

export const DateInput = memo(DateInputComponent, isSame);
