import { Icon } from "@/components/Icon";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { EditableComponentMapper } from "@/utils/editor";
import {
  DatePickerInputProps,
  DatePickerInput as MantineDatePickerInput,
} from "@mantine/dates";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { memo } from "react";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { useChangeState } from "@/hooks/useChangeState";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memoize } from "proxy-memoize";
import { useInputValue } from "@/hooks/useInputValue";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

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

  const [value, setValue] = useInputValue(
    {
      value: component.onLoad?.value ?? "",
    },
    component.id!,
  );
  const { onChange, ...restTriggers } = triggers || {};

  const handleChange = (value: Date | Date[] | null) => {
    if (!value) return;
    const newValue = getNewDate(value, valueFormatValue);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <>
      <MantineDatePickerInput
        {...(iconName && isPositionLeft && { icon: <Icon name={iconName} /> })}
        {...(iconName &&
          !isPositionLeft && { rightSection: <Icon name={iconName} /> })}
        {...props}
        {...componentProps}
        {...restTriggers}
        type={typeValue}
        valueFormat={valueFormatValue}
        value={!!value ? checkAndUpdateDate(value, typeValue) : undefined}
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
          ? component.children?.map((child) => renderTree(child))
          : children?.toString()}
      </MantineDatePickerInput>
    </>
  );
};

export const DateInput = memo(withComponentWrapper<Props>(DateInputComponent));

function pad(num: number) {
  return num.toString().padStart(2, "0");
}
function formatDate(date: Date, format: string) {
  const day = pad(date.getDate());
  const monthNumber = pad(date.getMonth() + 1); // Add 1 because getMonth() is zero-indexed
  const monthAbbreviation = date
    .toLocaleDateString(undefined, {
      month: "short",
    })
    .replace(".", "");
  const year = date.getFullYear().toString();

  let formattedDate = format
    .replace(/yyyy/gi, year)
    .replace(/dd/gi, day)
    .replace(/mmm/gi, monthAbbreviation);

  if (!formattedDate.includes(year)) {
    formattedDate = formattedDate.replace(/yy/gi, year.substring(2));
  }

  if (!formattedDate.includes(monthAbbreviation)) {
    formattedDate = formattedDate.replace(/mm/gi, monthNumber);
  }

  formattedDate = formattedDate.replace(/ /g, "-");

  return formattedDate;
}
const months: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const checkAndUpdateDate = (date: string | Array<string>, type: string) => {
  if (type !== "default" && typeof date === "string") return undefined;
  if (type === "default" && typeof date !== "string") return undefined;
  return parseDates(date, type);
};

const parseDates = (date: string | Array<string>, type: string) => {
  if (Array.isArray(date)) {
    return date.map((v) => parseDateString(v, type));
  }
  return parseDateString(date, type);
};
const parseDateString = (date: string, type: string) => {
  const typeArray = type.split(/\W+/);
  const monthIndex = typeArray.findIndex((v) => /m{1,3}/i.test(v));
  const dateArray = date.split(/\W+/);
  const month = dateArray[monthIndex];
  const isMonthNotValidNumber = isNaN(Number(month));
  if (!isMonthNotValidNumber) return new Date(date);
  dateArray[monthIndex] = months[month];
  return new Date(dateArray.join(" "));
};

const getNewDate = (date: Date | Date[], format: string) => {
  let newValue: string | Array<string>;
  if (date instanceof Date) {
    newValue = formatDate(date, format);
  } else {
    newValue = date.filter((v) => v).map((v) => formatDate(v, format));
  }
  return newValue;
};
