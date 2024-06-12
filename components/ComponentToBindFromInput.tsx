import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ValueProps } from "@/types/dataBinding";
import {
  Button,
  Flex,
  Group,
  NumberInputProps,
  SegmentedControlProps,
  SelectProps,
  Stack,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { FieldType } from "@/components/editor/BindingField/BindingField";
import { Icon } from "@/components/Icon";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { createContext, useContext } from "react";
import { ComponentToBindField } from "@/components/editor/BindingField/ComponentToBindField";
import { EditorProps } from "@monaco-editor/react";

// Need to extend input props depending on fieldType
type BaseProps = {
  fieldType: FieldType;
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  label?: string;
  isPageAction?: boolean;
  useTrueOrFalseStrings?: boolean;
  form?: any;
  children?: React.ReactNode;
};

type FieldProps<T extends FieldType> = BaseProps &
  (T extends "Text"
    ? Omit<TextInputProps, "onChange" | "value">
    : T extends "Number"
      ? Omit<NumberInputProps, "onChange" | "value">
      : T extends "Boolean" | "Segmented"
        ? Omit<SegmentedControlProps, "onChange" | "value">
        : T extends "Select"
          ? Omit<SelectProps, "onChange" | "value">
          : T extends "Array"
            ? Omit<EditorProps, "onChange" | "value">
            : {});

export type ComponentToBindFromInputProps<T extends FieldType> = FieldProps<T>;

type ComponentProps =
  | FieldProps<"Text">
  | FieldProps<"Number">
  | FieldProps<"Boolean">
  | FieldProps<"Select">
  | FieldProps<"Segmented">;

export const ComponentToBindContext = createContext<ComponentProps | null>(
  null,
);

export const useBindingField = <T extends FieldType>() => {
  const context = useContext(ComponentToBindContext);
  if (!context) {
    throw new Error(
      "useBindingField must be used within a ComponentToBindContext.Provider",
    );
  }

  if (context.fieldType !== (context as FieldProps<T>).fieldType) {
    throw new Error("Field type mismatch");
  }

  return context as FieldProps<T>;
};

export const ComponentToBindFromInput = <T extends FieldType>(
  props: ComponentToBindFromInputProps<T>,
) => {
  const { children, ...restProps } = props;

  return (
    <ComponentToBindContext.Provider value={restProps}>
      <ComponentToBindWrapper>{children}</ComponentToBindWrapper>
    </ComponentToBindContext.Provider>
  );
};

ComponentToBindFromInput.Text = function ComponentToBindFromTextInput() {
  const {
    placeholder,
    value,
    onChange,
    type = "text",
  } = useBindingField<"Text">();

  return (
    <ComponentToBindField.Text
      placeholder={placeholder}
      value={value?.static}
      type={type}
      onChange={(e: any) =>
        onChange({
          ...value,
          dataType: "static",
          static: e.currentTarget.value,
        })
      }
      {...AUTOCOMPLETE_OFF_PROPS}
      w="100%"
    />
  );
};

ComponentToBindFromInput.Array = function ComponentToBindFromArray() {
  const { value, onChange, defaultValue } = useBindingField<"Array">();
  return (
    <ComponentToBindField.Array
      value={value?.static?.toString() || (defaultValue as string)}
      onChange={(val) => {
        onChange({
          ...value,
          dataType: "static",
          static: val,
        });
      }}
      {...AUTOCOMPLETE_OFF_PROPS}
    />
  );
};

ComponentToBindFromInput.YesNo = function ComponentToBindFromYesNo() {
  const { value, onChange } = useBindingField();
  return (
    <ComponentToBindField.YesNo
      value={value?.static}
      onChange={(val) =>
        onChange({
          ...value,
          dataType: "static",
          static: val,
        })
      }
      w="100%"
      {...AUTOCOMPLETE_OFF_PROPS}
    />
  );
};

ComponentToBindFromInput.Boolean = function ComponentToBindFromBoolean() {
  const { value, onChange } = useBindingField();
  return (
    <ComponentToBindField.Boolean
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
      w="100%"
      {...AUTOCOMPLETE_OFF_PROPS}
    />
  );
};

ComponentToBindFromInput.Segmented = function ComponentToBindFromSegmented() {
  const { value, onChange, data } = useBindingField<"Segmented">();
  return (
    <ComponentToBindField.Boolean
      value={value?.static ?? ""}
      onChange={(val) =>
        onChange({
          ...value,
          dataType: "static",
          static: val,
        })
      }
      data={data}
      w="100%"
      {...AUTOCOMPLETE_OFF_PROPS}
    />
  );
};

ComponentToBindFromInput.Select = function ComponentToBindFromSelect() {
  const { value, onChange, data } = useBindingField<"Select">();
  return (
    <ComponentToBindField.Select
      value={value?.static ?? ""}
      onChange={(val) =>
        onChange({
          ...value,
          dataType: "static",
          static: val,
        })
      }
      data={data}
      w="100%"
      style={{ flex: "1" }}
      size="xs"
      nothingFound="Nothing found"
      searchable
      {...AUTOCOMPLETE_OFF_PROPS}
    />
  );
};

ComponentToBindFromInput.Number = function ComponentToBindFromNumber() {
  const { value, onChange, placeholder, precision, type } =
    useBindingField<"Number">();
  return (
    <ComponentToBindField.Number
      placeholder={placeholder}
      value={value?.static ? parseFloatExtension(value?.static) : ""}
      onChange={(val: number) =>
        onChange({
          ...value,
          dataType: "static",
          static: val.toString(),
        })
      }
      type={type}
      precision={precision}
      parser={(value) => (value ? parseFloatExtension(value).toString() : "")}
      formatter={(value) =>
        value ? parseFloatExtension(value).toString() : ""
      }
      w="100%"
      {...AUTOCOMPLETE_OFF_PROPS}
    />
  );
};

ComponentToBindFromInput.Options = function ComponentToBindFromOptions() {
  const { form } = useBindingField();
  return (
    <Stack style={{ gap: 0, width: "100%" }}>
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
                  {...AUTOCOMPLETE_OFF_PROPS}
                />
                <TextInput
                  size="xs"
                  placeholder="value"
                  {...form.getInputProps(`onLoad.data.static.${index}.value`)}
                  style={{ width: "50%" }}
                  {...AUTOCOMPLETE_OFF_PROPS}
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
