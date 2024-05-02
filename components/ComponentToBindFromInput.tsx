import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { useEditorStore } from "@/stores/editor";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ValueProps } from "@/types/dataBinding";
import {
  NumberInput,
  NumberInputProps,
  SegmentedControlProps,
  Stack,
  Text,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { MonacoEditorJson } from "./MonacoEditorJson";
import { SegmentedControlYesNo } from "./SegmentedControlYesNo";
import { TopLabel } from "./TopLabel";
import { FieldType } from "./data/forms/StaticFormFieldsBuilder";
import { SegmentedControlInput } from "./SegmentedControlInput";

// Need to extend input props depending on fieldType
type BaseProps = {
  fieldType?: FieldType;
  onPickComponent?: () => void;
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
      {["number", "integer"].includes(fieldType) ? (
        <NumberInput
          {...commonProps}
          placeholder={placeholder}
          value={value?.static ? parseFloatExtension(value?.static) : ""}
          onChange={(val) =>
            onChange({
              ...value,
              dataType: "static",
              static: val.toString(),
            })
          }
          {...props}
          precision={decimalPlaces}
          parser={(value) =>
            value ? parseFloatExtension(value).toString() : ""
          }
          formatter={(value) =>
            value ? parseFloatExtension(value).toString() : ""
          }
        />
      ) : fieldType === "boolean" ? (
        <Stack w="100%">
          <SegmentedControlInput
            {...commonProps}
            value={value?.static ?? ""}
            onChange={(val) =>
              onChange({
                ...value,
                dataType: "static",
                static: val,
              })
            }
            data={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
              { label: "-", value: "" },
            ]}
            {...props}
          />
        </Stack>
      ) : fieldType === "yesno" ? (
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
        <Stack w="100%" spacing={0}>
          <TopLabel text={label} required />
          {
            // @ts-ignore
            props?.description && (
              <Text size={10} color="dimmed">
                {
                  // @ts-ignore
                  props?.description
                }
              </Text>
            )
          }
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
        <Stack w="100%">
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
        </Stack>
      )}
    </ComponentToBindWrapper>
  );
};

function parseFloatExtension(value: any) {
  return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}
