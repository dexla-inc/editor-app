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
import { useEditorTreeStore } from "@/stores/editorTree";
import get from "lodash.get";

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
  isComponent?: boolean;
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
  form,
  isComponent,
  ...props
}: ComponentToBindFromInputProps<T>) => {
  const commonProps = {
    ...AUTOCOMPLETE_OFF_PROPS,
    ...props,
  };
  const language = useEditorTreeStore((state) => state.language);

  const fetchedValue = get(
    value?.static,
    language,
    isComponent ? undefined : value?.static,
  );

  const onChangeStatic = (val: any) => {
    onChange({
      ...value,
      dataType: "static",
      static: { ...value?.static, [language]: val },
    });
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
          value={fetchedValue ? parseFloatExtension(fetchedValue) : ""}
          onChange={(val) => onChangeStatic(val.toString())}
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
            value={fetchedValue ?? ""}
            onChange={(val) => onChangeStatic(val)}
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
          value={fetchedValue}
          onChange={(val) => onChangeStatic(val)}
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
            value={fetchedValue?.toString() || (props.defaultValue as string)}
            onChange={(val: any) => onChangeStatic(val)}
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
                form.insertListItem(`onLoad.data.static.${language}`, {
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
            {(form.values.onLoad.data.static?.[language] ?? [])?.map(
              (props: SelectProps, index: number) => {
                const target = "onLoad.data.static";
                return (
                  <Group key={index} style={{ flexWrap: "nowrap" }}>
                    <TextInput
                      size="xs"
                      placeholder="label"
                      {...form.getInputProps(
                        `${target}.${language}.${index}.label`,
                      )}
                      style={{ width: "50%" }}
                    />
                    <TextInput
                      size="xs"
                      placeholder="value"
                      {...form.getInputProps(
                        `onLoad.data.static.${language}.${index}.value`,
                      )}
                      style={{ width: "50%" }}
                    />

                    <Icon
                      name={ICON_DELETE}
                      onClick={() => {
                        form.removeListItem(
                          `onLoad.data.static.${language}`,
                          index,
                        );
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </Group>
                );
              },
            )}
          </Flex>
        </Stack>
      ) : (
        <Stack w="100%">
          <TextInput
            placeholder={placeholder}
            value={fetchedValue}
            type={fieldType}
            onChange={(e) => onChangeStatic(e.currentTarget.value)}
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
