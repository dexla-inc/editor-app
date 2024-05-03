import { Icon } from "@/components/Icon";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { EditableComponentMapper } from "@/utils/editor";
import {
  DatePickerInputProps,
  DatePickerInput as MantineDatePickerInput,
} from "@mantine/dates";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { memo } from "react";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useInputValue } from "@/hooks/components/useInputValue";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { getNewDate, setDate } from "@/utils/date";

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
    ...componentProps
  } = component.props as any;
  const { borderStyle, inputStyle } = useBrandingStyles();
  const { color, backgroundColor } = useChangeState({ bg, textColor });

  const customStyle = merge({}, borderStyle, inputStyle, props.style);
  const isPositionLeft =
    !iconPosition || (iconPosition && iconPosition === "left");
  const { type: typeValue, valueFormat: valueFormatValue } = component?.onLoad;

  const rootStyleProps = ["display", "width", "minHeight", "minWidth"];

  const [value, setValue] = useInputValue<string | string[]>(
    {
      value: component.onLoad?.value,
    },
    props.id!,
  );
  const { onChange, ...restTriggers } = triggers || {};

  const handleChange = (value: Date | Date[] | null) => {
    // Date Range check
    let formattedValue;

    if (Array.isArray(value)) {
      if (value.length === 2 && value[0] && value[1]) {
        formattedValue = getNewDate(value, valueFormatValue);
      } else {
        console.warn("Incomplete date range:", value);
        return;
      }
    } else if (value instanceof Date) {
      // Handle single date picker scenario
      formattedValue = getNewDate(value, valueFormatValue);
    }

    onChange?.({ target: { value: formattedValue ?? "" } });
    setValue(formattedValue ?? "");
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
