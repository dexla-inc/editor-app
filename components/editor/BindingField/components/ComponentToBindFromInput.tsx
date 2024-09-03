import { ComponentToBindWrapper } from "@/components/editor/BindingField/components/ComponentToBindWrapper";
import { ComponentToBindField } from "@/components/editor/BindingField/ComponentToBindField";
import { Icon } from "@/components/Icon";
import { useEditorTreeStore } from "@/stores/editorTree";
import { FieldType, ValueProps } from "@/types/dataBinding";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import {
  Button,
  Group,
  NumberInputProps,
  SegmentedControlProps,
  SelectProps,
  Stack,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { EditorProps } from "@monaco-editor/react";
import merge from "lodash.merge";
import { createContext, useContext } from "react";

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
  name?: string;
  defaultValue?: any;
};

type FieldTypeProps<T extends FieldType> = BaseProps &
  (T extends "Text"
    ? Omit<TextInputProps, "onChange" | "value">
    : T extends "Number"
      ? Omit<NumberInputProps, "onChange" | "value">
      : T extends "Boolean" | "Segmented"
        ? Omit<SegmentedControlProps, "onChange" | "value">
        : T extends "Select"
          ? Omit<SelectProps, "onChange" | "value">
          : T extends "TextArea" | "CustomJs"
            ? Omit<EditorProps, "onChange" | "value">
            : {});

export type ComponentToBindFromInputProps<T extends FieldType> =
  FieldTypeProps<T>;

type ComponentProps =
  | FieldTypeProps<"Text">
  | FieldTypeProps<"Number">
  | FieldTypeProps<"Boolean">
  | FieldTypeProps<"Select">
  | FieldTypeProps<"Segmented">;

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

  if (context.fieldType !== (context as FieldTypeProps<T>).fieldType) {
    throw new Error("Field type mismatch");
  }

  return context as FieldTypeProps<T>;
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
    staticValue,
    inputOnChange,
    type = "text",
    fieldType,
    isPageAction,
    label,
    ...defaultProps
  } = useBindingField<"Text">();

  return (
    <ComponentToBindField.Text
      {...defaultProps}
      {...AUTOCOMPLETE_OFF_PROPS}
      w="100%"
      value={staticValue}
      type={type}
      onChange={(val: any) => inputOnChange(val)}
    />
  );
};

ComponentToBindFromInput.TextArea = function ComponentToBindFromTextArea() {
  const {
    staticValue,
    inputOnChange,
    fieldType,
    isPageAction,
    label,
    ...defaultProps
  } = useBindingField<"TextArea">();
  const value =
    typeof staticValue === "string" ? staticValue : JSON.stringify(staticValue);

  return (
    <ComponentToBindField.TextArea
      {...defaultProps}
      {...AUTOCOMPLETE_OFF_PROPS}
      value={value}
      onChange={inputOnChange}
    />
  );
};

ComponentToBindFromInput.CustomJs = function ComponentToBindFromCustomJs() {
  const {
    staticValue,
    inputOnChange,
    fieldType,
    isPageAction,
    label,
    ...defaultProps
  } = useBindingField<"CustomJs">();
  const value =
    typeof staticValue === "string" ? staticValue : JSON.stringify(staticValue);

  return (
    <ComponentToBindField.CustomJs
      {...defaultProps}
      language="typescript"
      {...AUTOCOMPLETE_OFF_PROPS}
      value={value}
      onChange={inputOnChange}
    />
  );
};

ComponentToBindFromInput.YesNo = function ComponentToBindFromYesNo() {
  const {
    staticValue,
    inputOnChange,
    fieldType,
    isPageAction,
    label,
    defaultValue,
    ...defaultProps
  } = useBindingField<"Segmented">();

  return (
    <ComponentToBindField.YesNo
      {...defaultProps}
      {...AUTOCOMPLETE_OFF_PROPS}
      w="100%"
      value={staticValue ?? defaultValue}
      onChange={inputOnChange}
    />
  );
};

ComponentToBindFromInput.Boolean = function ComponentToBindFromBoolean() {
  const {
    staticValue,
    inputOnChange,
    fieldType,
    isPageAction,
    label,
    ...defaultProps
  } = useBindingField<"Boolean">();
  return (
    <ComponentToBindField.Boolean
      {...defaultProps}
      {...AUTOCOMPLETE_OFF_PROPS}
      w="100%"
      value={staticValue ?? ""}
      onChange={inputOnChange}
      data={[
        { label: "True", value: "true" },
        { label: "False", value: "false" },
        { label: "-", value: "" },
      ]}
    />
  );
};

ComponentToBindFromInput.Segmented = function ComponentToBindFromSegmented() {
  const {
    staticValue,
    inputOnChange,
    fieldType,
    isPageAction,
    label,
    ...defaultProps
  } = useBindingField<"Segmented">();
  return (
    <ComponentToBindField.Segmented
      {...defaultProps}
      {...AUTOCOMPLETE_OFF_PROPS}
      w="100%"
      value={staticValue ?? ""}
      onChange={inputOnChange}
    />
  );
};

ComponentToBindFromInput.Select = function ComponentToBindFromSelect() {
  const {
    staticValue,
    inputOnChange,
    fieldType,
    isPageAction,
    label,
    data = [],
    ...defaultProps
  } = useBindingField<"Select">();
  return (
    <ComponentToBindField.Select
      {...defaultProps}
      {...AUTOCOMPLETE_OFF_PROPS}
      w="100%"
      data={data}
      value={staticValue ?? ""}
      onChange={inputOnChange}
      style={{ flex: "1" }}
      size="xs"
      nothingFound="Nothing found"
      searchable
      {...AUTOCOMPLETE_OFF_PROPS}
    />
  );
};

ComponentToBindFromInput.Number = function ComponentToBindFromNumber() {
  const {
    staticValue,
    inputOnChange,
    fieldType,
    isPageAction,
    label,
    ...defaultProps
  } = useBindingField<"Number">();
  return (
    <ComponentToBindField.Number
      {...defaultProps}
      {...AUTOCOMPLETE_OFF_PROPS}
      w="100%"
      value={staticValue ? parseFloatExtension(staticValue) : ""}
      onChange={inputOnChange}
      parser={(value) => (value ? parseFloatExtension(value).toString() : "")}
      formatter={(value) =>
        value ? parseFloatExtension(value).toString() : ""
      }
    />
  );
};

ComponentToBindFromInput.Options = function ComponentToBindFromOptions() {
  const { form, isTranslatable } = useBindingField<"Options">();
  const language = useEditorTreeStore((state) => state.language);

  const staticValue = isTranslatable
    ? form.values.onLoad.data.static[language]
    : form.values.onLoad.data.static;

  return (
    <Stack w="100%" spacing={0}>
      <div>
        <Button
          type="button"
          compact
          onClick={() => {
            const fieldNamePrefix =
              "onLoad.data.static" + (isTranslatable ? `.${language}` : "");

            if (typeof staticValue === "string") {
              form.setFieldValue(fieldNamePrefix, []);
            }

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

      {!!staticValue.length && (
        <Stack spacing="10px" mt="10px">
          {(staticValue || [])?.map((_: SelectProps, index: number) => {
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
          })}
        </Stack>
      )}
    </Stack>
  );
};

function parseFloatExtension(value: any) {
  return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}
