import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ValueProps } from "@/types/dataBinding";
import {
  Button,
  Flex,
  Group,
  NumberInput,
  NumberInputProps,
  SegmentedControlProps,
  SelectProps,
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
import { Icon } from "@/components/Icon";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { createContext, useContext } from "react";

// Need to extend input props depending on fieldType
type BaseProps = {
  fieldType?: FieldType;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  placeholder?: string;
  label?: string;
  defaultValue?: any;
  decimalPlaces?: number;
  isPageAction?: boolean;
  useTrueOrFalseStrings?: boolean;
  form?: any;
  children: React.ReactNode;
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

const ComponentToBindContext = createContext<any>({});

export const ComponentToBindFromInput = <T extends FieldType | undefined>({
  placeholder = "",
  label = "Component to bind",
  value,
  onChange,
  fieldType = "Text",
  decimalPlaces,
  isPageAction,
  form,
  children,
  ...props
}: ComponentToBindFromInputProps<T>) => {
  const commonProps = {
    ...AUTOCOMPLETE_OFF_PROPS,
    ...props,
  };

  return (
    <ComponentToBindWrapper
      label={label}
      onChange={onChange}
      value={value}
      isPageAction={isPageAction}
    >
      <ComponentToBindContext.Provider
        value={{
          placeholder,
          label,
          value,
          onChange,
          fieldType,
          decimalPlaces,
          isPageAction,
          form,
          commonProps,
        }}
      >
        {children}
      </ComponentToBindContext.Provider>
    </ComponentToBindWrapper>
  );
};

ComponentToBindFromInput.Text = function ComponentToBindFromTextInput() {
  const { placeholder, value, fieldType, onChange, commonProps } = useContext(
    ComponentToBindContext,
  );

  return (
    <Stack w="100%">
      <TextInput
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
        {...commonProps}
      />
    </Stack>
  );
};

ComponentToBindFromInput.Array = function ComponentToBindFromArray() {
  const { label, value, onChange, commonProps } = useContext(
    ComponentToBindContext,
  );
  return (
    <Stack w="100%" spacing={0}>
      <TopLabel text={label} required />
      {
        // @ts-ignore
        commonProps?.description && (
          <Text size={10} color="dimmed">
            {
              // @ts-ignore
              commonProps?.description
            }
          </Text>
        )
      }
      <MonacoEditorJson
        value={
          value?.static?.toString() || (commonProps.defaultValue as string)
        }
        onChange={(val: any) => {
          onChange({
            ...value,
            dataType: "static",
            static: val,
          });
        }}
        {...commonProps}
      />
    </Stack>
  );
};

ComponentToBindFromInput.YesNo = function ComponentToBindFromYesNo() {
  const { value, onChange, commonProps } = useContext(ComponentToBindContext);
  return (
    <SegmentedControlYesNo
      value={value?.static}
      onChange={(val) =>
        onChange({
          ...value,
          dataType: "static",
          static: val,
        })
      }
      w="100%"
      {...commonProps}
    />
  );
};

ComponentToBindFromInput.Boolean = function ComponentToBindFromBoolean() {
  const { value, onChange, commonProps } = useContext(ComponentToBindContext);
  return (
    <Stack w="100%">
      <SegmentedControlInput
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
        {...commonProps}
      />
    </Stack>
  );
};

ComponentToBindFromInput.Number = function ComponentToBindFromNumber() {
  const { value, onChange, placeholder, decimalPlaces, commonProps } =
    useContext(ComponentToBindContext);
  return (
    <NumberInput
      placeholder={placeholder}
      value={value?.static ? parseFloatExtension(value?.static) : ""}
      onChange={(val) =>
        onChange({
          ...value,
          dataType: "static",
          static: val.toString(),
        })
      }
      precision={decimalPlaces}
      parser={(value) => (value ? parseFloatExtension(value).toString() : "")}
      formatter={(value) =>
        value ? parseFloatExtension(value).toString() : ""
      }
      {...commonProps}
    />
  );
};

ComponentToBindFromInput.Options = function ComponentToBindFromOptions() {
  const { form } = useContext(ComponentToBindContext);
  return (
    <Stack style={{ gap: 0 }}>
      <div>
        <Button
          type="button"
          compact
          onClick={() => {
            form.insertListItem("onLoad.data.static", {
              label: "",
              value: "",
            });
          }}
          variant="default"
          sx={{ marginRight: 0 }}
          leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
        >
          Add
        </Button>
      </div>

      <Flex direction="column" gap="10px" mt="10px">
        {(form.values.onLoad.data.static ?? [])?.map(
          (_: SelectProps, index: number) => {
            return (
              <Group key={index} style={{ flexWrap: "nowrap" }}>
                <TextInput
                  size="xs"
                  placeholder="label"
                  {...form.getInputProps(`onLoad.data.static.${index}.label`)}
                  style={{ width: "50%" }}
                />
                <TextInput
                  size="xs"
                  placeholder="value"
                  {...form.getInputProps(`onLoad.data.static.${index}.value`)}
                  style={{ width: "50%" }}
                />

                <Icon
                  name={ICON_DELETE}
                  onClick={() => {
                    form.removeListItem("onLoad.data.static", index);
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Group>
            );
          },
        )}
      </Flex>
    </Stack>
  );
};

function parseFloatExtension(value: any) {
  return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}
