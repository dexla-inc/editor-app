import { useEditorStore } from "@/stores/editor";
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

type Unit = "px" | "rem" | "%" | "vh" | "vw" | "auto";

type Props = {
  value?: string;
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
  const theme = useMantineTheme();
  const defaultComponentWidth = useEditorStore(
    (state) => state.defaultComponentWidth,
  );

  const options = customOptions ?? [
    { value: "px", label: "PX" },
    { value: "%", label: "%" },
    { value: "vh", label: "VH" },
    { value: "vw", label: "VW" },
    { value: "auto", label: "auto" },
  ];

  const [splitValue, splitUnit] = splitValueAndUnit(
    !!fetchedValue ? (fetchedValue as string).toString() : "",
  ) ?? [0, "auto"];

  const [value, setValue] = useState<number | "auto">();
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
      onChange(unit === "auto" ? "auto" : `${value}${unit}`);
    }
    // Disable as we don't want to force an useCallback on every onChange being passed down
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, unit]);

  const isAuto = (unit ?? splitUnit) === "auto";

  const handleChange = (val: string, isTextInput: boolean = false) => {
    if (!isNaN(Number(val))) {
      if (unit === "auto" && val !== "") {
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
        } else if (newUnit === "px" && value === "auto") {
          // Example: Defaulting to a specific value when switching to 'px'
          setValue(modifierType === "size" ? defaultComponentWidth : 0);
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
