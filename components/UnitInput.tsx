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
  const [_, splitValue, splitUnit] = (fetchedValue &&
    (fetchedValue as string).split(/(\d+)/)) || ["", ""];
  const [unit, setUnit] = useState<Unit>((splitUnit as Unit) || "px");
  const [value, setValue] = useState<number>();

  useEffect(() => {
    if (onChange) {
      onChange(`${value}${unit}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, value]);

  return (
    <NumberInput
      size="xs"
      hideControls
      value={value ? value : splitValue ? parseInt(splitValue, 10) : undefined}
      onChange={setValue as any}
      {...props}
      rightSection={
        <Select
          size="xs"
          variant="filled"
          value={unit}
          onChange={(val: "px" | "rem" | "%") => setUnit(val)}
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
