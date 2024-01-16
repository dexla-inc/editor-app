import { DARK_COLOR, GRAY_BORDER_COLOR } from "@/utils/branding";
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

type Unit = "px" | "rem" | "%" | "vh" | "vw" | "auto" | "fit-content";

type Props = {
  value?: string | "auto" | "fit-content";
  onChange?: (value: string) => void;
  disabledUnits?: Unit[];
  options?: SelectItem[];
  modifierType?: string;
};

export const UnitInput = ({
  value: fetchedValue = "",
  onChange,
  disabledUnits,
  options: customOptions,
  modifierType,
  ...props
}: Props & Omit<NumberInputProps, "onChange">) => {
  useEffect(() => {
    console.log("UnitInput", fetchedValue);
  }, [fetchedValue]);

  const theme = useMantineTheme();

  const options = customOptions ?? [
    { value: "px", label: "PX" },
    { value: "%", label: "%" },
    { value: "vh", label: "VH" },
    { value: "vw", label: "VW" },
    { value: "auto", label: "auto" },
    { value: "fit-content", label: "fit" },
  ];

  const isUnit =
    fetchedValue && fetchedValue !== "auto" && fetchedValue !== "fit-content";

  const [splitValue, splitUnit] = isUnit
    ? splitValueAndUnit(fetchedValue) || [0, "auto"]
    : [0, fetchedValue === "" ? "auto" : (fetchedValue as Unit)];

  const [value, setValue] = useState<number | "auto" | "fit-content">();
  const [textValue, setTextValue] = useState<string>();
  const [unit, setUnit] = useState<Unit>();

  const convertUnits = (value: any, currentUnit: Unit, targetUnit: Unit) => {
    const baseFontSize = 16; // Assuming 1rem = 16px
    let newValue = parseFloat(value);
    if (isNaN(newValue)) return value;

    if (currentUnit === "rem" && targetUnit === "px") {
      newValue = newValue * baseFontSize;
    } else if (currentUnit === "px" && targetUnit === "rem") {
      newValue = newValue / baseFontSize;
    }

    return newValue;
  };

  useEffect(() => {
    if (
      onChange &&
      typeof value !== "undefined" &&
      typeof unit !== "undefined"
    ) {
      onChange(
        unit === "auto"
          ? "auto"
          : unit === "fit-content"
          ? "fit-content"
          : `${value}${unit}`,
      );
    }
    // Disable as we don't want to force an useCallback on every onChange being passed down
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, unit]);

  useEffect(() => {
    if (fetchedValue) {
      switch (fetchedValue) {
        case "auto":
          setTextValue("auto");
          break;
        case "fit-content":
          setTextValue("fit");
          break;
        default:
          setTextValue(splitValue.toString());
      }
    } else {
      setTextValue("auto");
    }
  }, [fetchedValue, splitValue, splitUnit]);

  const isAutoOrFit =
    (unit ?? splitUnit) === "auto" || (unit ?? splitUnit) === "fit-content";

  const handleChange = (val: string, isTextInput: boolean = false) => {
    if (!isNaN(Number(val))) {
      if ((unit === "auto" || unit === "fit-content") && val !== "") {
        setValue(Number(val));
        setUnit("px");
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
      onChange={(newUnit: Unit) => {
        // Perform conversion only if the current unit and value are defined
        if (typeof value !== "undefined" && unit) {
          const convertedValue = convertUnits(value, unit, newUnit);
          setValue(convertedValue); // Update the value state with converted value
        }
        setUnit(newUnit); // Update the unit state

        // If the new unit is a special case like %, vh, vw, handle them accordingly
        if (newUnit === "%" || newUnit === "vh" || newUnit === "vw") {
          setValue(100);
        } else if (newUnit === "auto") {
          setValue("auto");
          setTextValue("auto");
        } else if (newUnit === "fit-content") {
          setValue("fit-content");
          setTextValue("fit");
        } else if (newUnit === "px" && value === "auto") {
          // Example: Defaulting to a specific value when switching to 'px'
          setValue(modifierType === "size" ? "fit-content" : 0);
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
          borderLeft: "none",
          "&:focus": {
            borderColor:
              theme.colorScheme === "light" ? GRAY_BORDER_COLOR : DARK_COLOR,
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

  if (isAutoOrFit) {
    return (
      <TextInput
        size="xs"
        {...props}
        value={textValue}
        onChange={(e) => {
          handleChange(e.target.value, true);
        }}
        rightSection={RightSection}
        rightSectionWidth={53}
        sx={{
          input: {
            "&:focus": {
              borderColor:
                theme.colorScheme === "light" ? GRAY_BORDER_COLOR : DARK_COLOR,
            },
          },
        }}
      />
    );
  } else {
    return (
      <NumberInput
        size="xs"
        hideControls
        precision={3}
        parser={(value) => parseFloat(value).toString()}
        formatter={(value) => parseFloat(value).toString()}
        value={(value ?? splitValue) as number}
        onChange={(val: number) => {
          handleChange(val.toString());
        }}
        {...props}
        rightSection={RightSection}
        rightSectionWidth={53}
        sx={{
          input: {
            "&:focus": {
              borderColor:
                theme.colorScheme === "light" ? GRAY_BORDER_COLOR : DARK_COLOR,
            },
          },
        }}
      />
    );
  }
};
