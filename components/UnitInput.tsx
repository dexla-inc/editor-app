import { splitValueAndUnit } from "@/utils/splitValueAndUnit";
import {
  NumberInput,
  NumberInputProps,
  Select,
  SelectItem,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";

type Unit = "px" | "rem" | "%" | "vh" | "vw" | "auto";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  disabledUnits?: Unit[];
  options?: SelectItem[];
};

export const UnitInput = ({
  value: fetchedValue = "",
  onChange,
  disabledUnits,
  options: customOptions,
  ...props
}: Props & Omit<NumberInputProps, "onChange">) => {
  const theme = useMantineTheme();

  const options = customOptions ?? [
    { value: "px", label: "PX" },
    { value: "rem", label: "REM" },
    { value: "%", label: "%" },
    { value: "vh", label: "VH" },
    { value: "vw", label: "VW" },
    { value: "auto", label: "auto" },
  ];

  const [splitValue, splitUnit] = splitValueAndUnit(
    fetchedValue.toString(),
  ) ?? [0, "auto"];

  const [value, setValue] = useState<number | "auto">();
  const [textValue, setTextValue] = useState<string>();
  const [unit, setUnit] = useState<Unit>();

  useEffect(() => {
    if (
      onChange &&
      typeof value !== "undefined" &&
      typeof unit !== "undefined"
    ) {
      onChange(unit === "auto" ? "auto" : `${value}${unit}`);
    }
    // Disable as we don't want to force an useCallback on every onChange being passed down
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, unit]);

  const isAuto = (unit ?? splitUnit) === "auto";

  const handleChange = (val: string, isTextInput: boolean = false) => {
    if (!isNaN(Number(val))) {
      if (unit === "auto" && val !== "") {
        setUnit("px");
        setValue(Number(val));
      } else {
        isTextInput ? setTextValue(val) : setValue(Number(val));
        setUnit((unit ?? splitUnit) as Unit);
      }
    }
  };

  const RightSection = (
    <Select
      size="xs"
      variant="filled"
      value={unit ?? splitUnit}
      onChange={(val: Unit) => {
        setUnit(val);
        if (val === "%" || val === "vh" || val === "vw") {
          setValue(100);
        } else if (val === "px") {
          if (value === undefined) {
            setValue(0 as number);
          } else {
            setValue(value === "auto" ? 0 : value);
          }
        } else if (value === "auto" || val === "auto") {
          setValue("auto");
          setTextValue("auto");
        } else {
          setValue(value ?? splitValue);
        }
      }}
      data={options.filter((o) => !disabledUnits?.includes(o.value as Unit))}
      styles={{
        input: {
          fontSize: "8px",
          paddingLeft: "0.8rem",
          paddingRight: "1rem",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          border: `1px solid ${theme.colors.gray[4]}`,
          borderLeft: "none",
          "&:focus": {
            borderColor: theme.colors.gray[4],
          },
        },
        item: {
          fontSize: "8px",
        },
      }}
      rightSectionProps={{
        style: {
          width: "1rem",
          margin: "0 5px",
        },
      }}
    />
  );

  if (isAuto) {
    return (
      <TextInput
        size="xs"
        {...props}
        value={textValue || "auto"}
        onChange={(e) => {
          handleChange(e.target.value, true);
        }}
        rightSection={RightSection}
        rightSectionWidth={53}
      />
    );
  } else {
    return (
      <NumberInput
        size="xs"
        hideControls
        value={(value ?? splitValue) as number}
        onChange={(val: number) => {
          handleChange(val.toString());
        }}
        {...props}
        rightSection={RightSection}
        rightSectionWidth={53}
      />
    );
  }
};
