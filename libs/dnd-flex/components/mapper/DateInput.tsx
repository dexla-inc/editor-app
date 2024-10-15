import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { getNewDate, setDate } from "@/utils/date";
import { EditableComponentMapper } from "@/utils/editor";
import {
  DatePickerInputProps,
  DatePickerInput as MantineDatePickerInput,
} from "@mantine/dates";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { memo } from "react";

type Props = EditableComponentMapper & DatePickerInputProps;

const DateInputComponent = ({
  renderTree,
  component,
  shareableContent,
  ...props
}: Props) => {
  const {
    children,
    icon: iconName,
    iconPosition,
    triggers,
    styles,
    bg,
    textColor,
    placeholderColor,
    withTimeZone,
    ...restComponentProps
  } = component.props as any;

  const {
    type: typeValue,
    valueFormat: valueFormatValue,
    placeholder = component.props?.placeholder,
  } = component?.onLoad;

  const componentProps = { ...restComponentProps, placeholder };
  const { borderStyle, inputStyle } = useBrandingStyles();
  const {
    color,
    backgroundColor,
    placeholderColor: _placeholderColor,
  } = useChangeState({ bg, textColor, placeholderColor });

  const customStyle = merge({}, borderStyle, inputStyle, props.style);
  const isPositionLeft =
    !iconPosition || (iconPosition && iconPosition === "left");

  const rootStyleProps = ["display", "width", "minHeight", "minWidth"];

  const [value, setValue] = useInputValue<string | string[]>(
    {
      value: component.onLoad?.value,
    },
    props.id!,
  );
  const { onChange, ...restTriggers } = triggers || {};

  const formatValue = (value: Date | Date[] | null) => {
    // Date Range check
    let formattedValue;

    if (Array.isArray(value)) {
      if (value.length === 2 && value[0] && value[1]) {
        formattedValue = getNewDate(value, valueFormatValue, withTimeZone);
      } else if (value[0] === null && value[1] === null) {
        formattedValue = getNewDate(value, valueFormatValue, withTimeZone);
      } else {
        console.warn("Incomplete date range:", value);
        return;
      }
    } else if (value instanceof Date) {
      // Handle single date picker scenario
      formattedValue = getNewDate(value, valueFormatValue, withTimeZone);
    }

    return formattedValue;
  };

  const handleChange = (value: Date | Date[] | null) => {
    const formattedValue = formatValue(value) ?? "";
    onChange?.({ target: { formattedValue } });
    setValue(formattedValue);
  };

  const dateInputValue = setDate(value, typeValue, valueFormatValue);

  return (
    <>
      <MantineDatePickerInput
        {...(iconName && isPositionLeft && { icon: <Icon name={iconName} /> })}
        {...(iconName &&
          !isPositionLeft && { rightSection: <Icon name={iconName} /> })}
        {...props}
        {...componentProps}
        type={typeValue}
        valueFormat={valueFormatValue}
        value={dateInputValue}
        {...restTriggers}
        wrapperProps={{ "data-id": props.id }}
        onChange={handleChange}
        style={{}}
        styles={{
          root: {
            position: "relative",
            ...pick(customStyle, rootStyleProps),
            height: "fit-content",
          },
          input: {
            ...omit(customStyle, rootStyleProps),
            color,
            backgroundColor,
          },
          icon: {
            color,
          },
          placeholder: {
            color: `${_placeholderColor}!important`,
          },
        }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : children?.toString()}
      </MantineDatePickerInput>
    </>
  );
};

export const DateInput = memo(withComponentWrapper<Props>(DateInputComponent));
