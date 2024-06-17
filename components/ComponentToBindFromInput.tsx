import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { FieldType, ValueProps } from "@/types/dataBinding";
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
import { Icon } from "@/components/Icon";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { createContext, useContext } from "react";
import { ComponentToBindField } from "@/components/editor/BindingField/ComponentToBindField";
import { EditorProps } from "@monaco-editor/react";
import { useEditorTreeStore } from "@/stores/editorTree";
import merge from "lodash.merge";

// Need to extend input props depending on fieldType
type BaseProps = {
  fieldType: FieldType;
  value: ValueProps;
  onChange: (value: ValueProps | any) => void;
  label?: string;
  isPageAction?: boolean;
  isTranslatable?: boolean;
  useTrueOrFalseStrings?: boolean;
  form?: any;
  children?: React.ReactNode;
  staticValue?: any;
  inputOnChange?: any;
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
  const language = useEditorTreeStore((state) => state.language);
  const { children, ...restProps } = props;

  const staticValue = restProps.isTranslatable
    ? restProps.value?.static?.[language]
    : restProps.value?.static;

  const inputOnChange = <T extends unknown>(val: T) => {
    const newValue = merge(restProps.value, {
      dataType: "static",
      static: restProps.isTranslatable ? { [language]: val } : val,
    });

    restProps.onChange(newValue);
  };

  return (
    <ComponentToBindContext.Provider
      value={{ ...restProps, inputOnChange, staticValue }}
    >
      <ComponentToBindWrapper>{children}</ComponentToBindWrapper>
    </ComponentToBindContext.Provider>
  );
};

ComponentToBindFromInput.Text = function ComponentToBindFromTextInput() {
  const {
    placeholder,
    staticValue,
    onChange,
    type = "text",
  } = useBindingField<"Text">();

  return (
    <ComponentToBindField.Text
      placeholder={placeholder}
      value={staticValue}
      type={type}
      onChange={(e) => onChange(e.currentTarget.value)}
      {...AUTOCOMPLETE_OFF_PROPS}
      w="100%"
    />
  );
};

ComponentToBindFromInput.Array = function ComponentToBindFromArray() {
  const { staticValue, inputOnChange, defaultValue } =
    useBindingField<"Array">();
  return (
    <ComponentToBindField.Array
      value={staticValue?.toString() || (defaultValue as string)}
      onChange={inputOnChange}
      {...AUTOCOMPLETE_OFF_PROPS}
    />
  );
};

ComponentToBindFromInput.YesNo = function ComponentToBindFromYesNo() {
  const { staticValue, inputOnChange } = useBindingField();
  return (
    <ComponentToBindField.YesNo
      value={staticValue}
      onChange={inputOnChange}
      w="100%"
      {...AUTOCOMPLETE_OFF_PROPS}
    />
  );
};

ComponentToBindFromInput.Boolean = function ComponentToBindFromBoolean() {
  const { staticValue, inputOnChange } = useBindingField();
  return (
    <ComponentToBindField.Boolean
      value={staticValue ?? ""}
      onChange={inputOnChange}
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
  const { staticValue, inputOnChange, data } = useBindingField<"Segmented">();
  return (
    <ComponentToBindField.Boolean
      value={staticValue ?? ""}
      onChange={inputOnChange}
      data={data}
      w="100%"
      {...AUTOCOMPLETE_OFF_PROPS}
    />
  );
};

ComponentToBindFromInput.Select = function ComponentToBindFromSelect() {
  const { staticValue, inputOnChange, data } = useBindingField<"Select">();
  return (
    <ComponentToBindField.Select
      value={staticValue ?? ""}
      onChange={inputOnChange}
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
  const { staticValue, inputOnChange, placeholder, precision, type } =
    useBindingField<"Number">();
  return (
    <ComponentToBindField.Number
      placeholder={placeholder}
      value={staticValue ? parseFloatExtension(staticValue) : ""}
      onChange={inputOnChange}
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
  const { form, isTranslatable } = useBindingField();
  const language = useEditorTreeStore((state) => state.language);
  return (
    <Stack style={{ gap: 0, width: "100%" }}>
      <div>
        <Button
          type="button"
          compact
          onClick={() => {
            const fieldNamePrefix =
              "onLoad.data.static" + (isTranslatable ? `.${language}` : "");
            form.insertListItem(fieldNamePrefix, {
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
            const fieldNamePrefix =
              "onLoad.data.static" + (isTranslatable ? `.${language}` : "");
            return (
              <Group key={index} style={{ flexWrap: "nowrap" }}>
                <TextInput
                  size="xs"
                  placeholder="label"
                  {...form.getInputProps(`${fieldNamePrefix}.${index}.label`)}
                  style={{ width: "50%" }}
                  {...AUTOCOMPLETE_OFF_PROPS}
                />
                <TextInput
                  size="xs"
                  placeholder="value"
                  {...form.getInputProps(`${fieldNamePrefix}.${index}.value`)}
                  style={{ width: "50%" }}
                  {...AUTOCOMPLETE_OFF_PROPS}
                />

                <Icon
                  name={ICON_DELETE}
                  onClick={() => {
                    form.removeListItem(fieldNamePrefix, index);
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
