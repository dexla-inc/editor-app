import { ComponentToBindWrapper } from "@/components/ComponentToBindWrapper";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { FieldType, ValueProps } from "@/types/dataBinding";
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
import { SegmentedControlInput } from "./SegmentedControlInput";
import { Icon } from "@/components/Icon";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { useEditorTreeStore } from "@/stores/editorTree";
import merge from "lodash.merge";

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
  isTranslatable?: boolean;
  useTrueOrFalseStrings?: boolean;
  form?: any;
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
  placeholder = "",
  label = "Component to bind",
  value,
  onChange,
  fieldType = "text",
  decimalPlaces,
  isPageAction,
  isTranslatable = false,
  form,
  ...props
}: ComponentToBindFromInputProps<T>) => {
  const language = useEditorTreeStore((state) => state.language);

  const commonProps = {
    ...AUTOCOMPLETE_OFF_PROPS,
    ...props,
  };
  const staticValue = isTranslatable
    ? value?.static?.[language]
    : value?.static;

  const customOnChange = <T extends unknown>(val: T) => {
    const newValue = merge(value, {
      dataType: "static",
      static: isTranslatable ? { [language]: val } : val,
    });

    onChange(newValue);
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
          placeholder={placeholder}
          value={staticValue ? parseFloatExtension(staticValue) : ""}
          onChange={(val) => customOnChange<string>(val.toString())}
          precision={decimalPlaces}
          parser={(value) =>
            value ? parseFloatExtension(value).toString() : ""
          }
          formatter={(value) =>
            value ? parseFloatExtension(value).toString() : ""
          }
          {...commonProps}
        />
      ) : fieldType === "boolean" ? (
        <Stack w="100%">
          <SegmentedControlInput
            value={staticValue ?? ""}
            onChange={customOnChange}
            data={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
              { label: "-", value: "" },
            ]}
            {...commonProps}
          />
        </Stack>
      ) : fieldType === "yesno" ? (
        <SegmentedControlYesNo
          value={staticValue ?? true}
          onChange={customOnChange}
          w="100%"
          {...commonProps}
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
            value={staticValue?.toString() || (props.defaultValue as string)}
            onChange={customOnChange}
            {...commonProps}
          />
        </Stack>
      ) : fieldType === "options" ? (
        <Stack style={{ gap: 0 }}>
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
            {(staticValue ?? [])?.map((_: SelectProps, index: number) => {
              const fieldNamePrefix =
                "onLoad.data.static" + (isTranslatable ? `.${language}` : "");
              console.log(fieldNamePrefix);
              return (
                <Group key={index} style={{ flexWrap: "nowrap" }}>
                  <TextInput
                    size="xs"
                    placeholder="label"
                    {...form.getInputProps(`${fieldNamePrefix}.${index}.label`)}
                    style={{ width: "50%" }}
                  />
                  <TextInput
                    size="xs"
                    placeholder="value"
                    {...form.getInputProps(`${fieldNamePrefix}.${index}.value`)}
                    style={{ width: "50%" }}
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
          </Flex>
        </Stack>
      ) : (
        <Stack w="100%">
          <TextInput
            placeholder={placeholder}
            value={staticValue}
            type={fieldType}
            onChange={(e) => customOnChange<string>(e.currentTarget.value)}
            {...commonProps}
          />
        </Stack>
      )}
    </ComponentToBindWrapper>
  );
};

function parseFloatExtension(value: any) {
  return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}
