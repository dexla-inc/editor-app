import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { useEditorStore } from "@/stores/editor";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ValueProps } from "@/types/dataBinding";
import {
  NumberInput,
  NumberInputProps,
  SegmentedControlProps,
  Stack,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { MonacoEditorJson } from "./MonacoEditorJson";
import { SegmentedControlYesNo } from "./SegmentedControlYesNo";
import { TopLabel } from "./TopLabel";
import { FieldType } from "./data/forms/StaticFormFieldsBuilder";

// Need to extend input props depending on fieldType
type BaseProps = {
  fieldType?: FieldType;
  onPickComponent?: () => void;
  isLogicFlow?: boolean;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  placeholder?: string;
  label?: string;
  defaultValue?: any;
  decimalPlaces?: number;
  isPageAction?: boolean;
  useTrueOrFalseStrings?: boolean;
};

// Define a helper type for the conditional props extension
type ExtendedPropsByFieldType<T> = T extends "text"
  ? Omit<TextInputProps, "onChange" | "value">
  : T extends "number"
  ? Omit<NumberInputProps, "onChange" | "value">
  : T extends "boolean"
  ? Omit<SegmentedControlProps, "onChange" | "value">
  : {};

// Define the component props type using a generic parameter for fieldType
type ComponentToBindFromInputProps<T extends FieldType | undefined> =
  BaseProps & ExtendedPropsByFieldType<T>;

export const ComponentToBindFromInput = <T extends FieldType | undefined>({
  onPickComponent,
  placeholder = "",
  label = "Component to bind",
  isLogicFlow,
  value,
  onChange,
  fieldType = "text",
  decimalPlaces,
  isPageAction,
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
    <ComponentToBindWrapper
      label={label}
      onChange={onChange}
      value={value}
      isPageAction={isPageAction}
    >
      {fieldType === "number" ? (
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
      ) : fieldType === "boolean" ? (
        <SegmentedControlYesNo
          {...commonProps}
          value={value?.static}
          onChange={(val) =>
            onChange({
              ...value,
              dataType: "static",
              static: val,
            })
          }
          w="100%"
          {...props}
        />
      ) : fieldType === "array" ? (
        <Stack w="100%">
          <TopLabel text={label} required />
          <MonacoEditorJson
            {...commonProps}
            value={value?.static?.toString() || (props.defaultValue as string)}
            onChange={(val: any) => {
              onChange({
                ...value,
                dataType: "static",
                static: val,
              });
            }}
            {...props}
          />
        </Stack>
      ) : (
        <TextInput
          {...commonProps}
          placeholder={placeholder}
          value={value?.static}
          type={fieldType}
          onChange={(e) =>
            onChange({
              ...value,
              dataType: "static",
              static: e.currentTarget.value,
            })
          }
          {...props}
        />
      )}
    </ComponentToBindWrapper>
  );
};

function parseFloatExtension(value: any) {
  return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}
