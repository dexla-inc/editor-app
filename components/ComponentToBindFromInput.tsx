import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { useEditorStore } from "@/stores/editor";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ValueProps } from "@/utils/types";
import {
  NumberInput,
  NumberInputProps,
  SegmentedControlProps,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { SegmentedControlYesNo } from "./SegmentedControlYesNo";
import { FieldType } from "./data/forms/StaticFormFieldsBuilder";

// Need to extend input props depending on fieldType
type BaseProps = {
  fieldType?: FieldType;
  componentId?: string;
  onPickComponent?: () => void;
  isLogicFlow?: boolean;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  placeholder?: string;
  label?: string;
  defaultValue?: any;
  decimalPlaces?: number;
};

// Define a helper type for the conditional props extension
type ExtendedPropsByFieldType<T> = T extends "text"
  ? Omit<TextInputProps, "onChange" | "value">
  : T extends "number"
  ? Omit<NumberInputProps, "onChange" | "value">
  : T extends "yesno"
  ? Omit<SegmentedControlProps, "onChange" | "value">
  : {};

// Define the component props type using a generic parameter for fieldType
type ComponentToBindFromInputProps<T extends FieldType | undefined> =
  BaseProps & ExtendedPropsByFieldType<T>;

export const ComponentToBindFromInput = <T extends FieldType | undefined>({
  componentId,
  onPickComponent,
  placeholder = "",
  label = "Component to bind",
  isLogicFlow,
  value,
  onChange,
  fieldType = "text",
  decimalPlaces,
  ...props
}: ComponentToBindFromInputProps<T>) => {
  const setHighlightedComponentId = useEditorStore(
    (state) => state.setHighlightedComponentId,
  );

  const commonProps = {
    label,
    onFocus: (e: any) => {
      setHighlightedComponentId(e.target.value);
    },
    onBlur: () => {
      setHighlightedComponentId(null);
    },
    ...AUTOCOMPLETE_OFF_PROPS,
  };

  return (
    <ComponentToBindWrapper onChange={onChange} value={value}>
      {fieldType === "text" ? (
        <TextInput
          {...commonProps}
          placeholder={placeholder}
          value={value?.static}
          onChange={(e) =>
            onChange({
              ...value,
              dataType: "static",
              static: e.currentTarget.value,
            })
          }
          {...props}
        />
      ) : fieldType === "number" ? (
        <NumberInput
          {...commonProps}
          placeholder={placeholder}
          value={parseFloatExtension(value?.static)}
          onChange={(val) =>
            onChange({
              ...value,
              dataType: "static",
              static: val.toString(),
            })
          }
          {...props}
          precision={decimalPlaces}
          parser={(value) => parseFloatExtension(value).toString()}
          formatter={(value) => parseFloatExtension(value).toString()}
        />
      ) : fieldType === "yesno" ? (
        <SegmentedControlYesNo
          {...commonProps}
          value={value?.static}
          onChange={(val) =>
            onChange({
              ...value,
              dataType: "static",
              static: val.toString(),
            })
          }
          w="100%"
        />
      ) : null}
    </ComponentToBindWrapper>
  );
};

function parseFloatExtension(value: any) {
  return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}
