import { splitValueAndUnit } from "@/utils/splitValueAndUnit";
import {
  NumberInput,
  NumberInputProps,
  Select,
  SelectItem,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";

type Unit = "px" | "rem" | "%";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  disabledUnits?: Unit[];
};

const options: SelectItem[] = [
  { value: "px", label: "PX" },
  { value: "rem", label: "REM" },
  { value: "%", label: "%" },
];

export const UnitInput = ({
  value: fetchedValue = "",
  onChange,
  disabledUnits,
  ...props
}: Props & NumberInputProps) => {
  const theme = useMantineTheme();

  const [splitValue, splitUnit] = splitValueAndUnit(fetchedValue) ?? [0, "px"];

  const [value, setValue] = useState<number>();
  const [unit, setUnit] = useState<Unit>();

  useEffect(() => {
    if (onChange) {
      onChange(`${value}${unit}`);
    }
    // Disable as we don't want to force an useCallback on every onChange being passed down
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, unit]);

  return (
    <NumberInput
      size="xs"
      hideControls
      defaultValue={splitValue}
      value={value ?? splitValue ?? undefined}
      onChange={(val: number) => {
        setValue(val);
        setUnit((unit ?? splitUnit) as Unit);
      }}
      {...props}
      rightSection={
        <Select
          size="xs"
          variant="filled"
          defaultValue={splitUnit}
          value={unit ?? splitUnit}
          onChange={setUnit as any}
          data={options.filter(
            (o) => !disabledUnits?.includes(o.value as Unit)
          )}
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
      }
      rightSectionWidth={53}
    />
  );
};
