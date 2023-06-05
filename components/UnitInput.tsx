import { splitValueAndUnit } from "@/utils/splitValueAndUnit";
import {
  Input,
  NumberInput,
  NumberInputProps,
  Select,
  SelectItem,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";

type Unit = "px" | "rem" | "%" | "auto";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  disabledUnits?: Unit[];
};

const options: SelectItem[] = [
  { value: "px", label: "PX" },
  { value: "rem", label: "REM" },
  { value: "%", label: "%" },
  { value: "auto", label: "auto" },
];

export const UnitInput = ({
  value: fetchedValue = "",
  onChange,
  disabledUnits,
  ...props
}: Props & NumberInputProps) => {
  const theme = useMantineTheme();

  const [splitValue, splitUnit] = splitValueAndUnit(fetchedValue) ?? [
    0,
    "auto",
  ];

  const [value, setValue] = useState<number | "auto">();
  const [unit, setUnit] = useState<Unit>();

  useEffect(() => {
    if (onChange) {
      onChange(unit === "auto" ? "auto" : `${value}${unit}`);
    }
    // Disable as we don't want to force an useCallback on every onChange being passed down
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, unit]);

  const isAuto = (unit ?? splitUnit) === "auto";

  const RightSection = (
    <Select
      size="xs"
      variant="filled"
      defaultValue={splitUnit}
      value={unit ?? splitUnit}
      onChange={(val: Unit) => {
        setUnit(val);
        if (value === "auto") {
          setValue(0);
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
        value="auto"
        onChange={(val: any) => {
          setValue(val);
          setUnit((unit ?? splitUnit) as Unit);
        }}
        rightSection={RightSection}
        rightSectionWidth={53}
      />
    );
  }

  return (
    <NumberInput
      size="xs"
      hideControls
      defaultValue={splitValue}
      value={(value ?? splitValue) as number}
      onChange={(val: any) => {
        setValue(val);
        setUnit((unit ?? splitUnit) as Unit);
      }}
      {...props}
      rightSection={RightSection}
      rightSectionWidth={53}
    />
  );
};
