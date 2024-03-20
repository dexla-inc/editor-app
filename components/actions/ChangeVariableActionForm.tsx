import { FieldType } from "@/components/data/forms/StaticFormFieldsBuilder";
import { VariableSelect } from "@/components/variables/VariableSelect";
import { FrontEndTypes } from "@/requests/variables/types";
import { ActionFormProps, ChangeVariableAction } from "@/utils/actions";
import { ArrayMethods } from "@/utils/types";
import { Select, Stack } from "@mantine/core";
import { ComponentToBindFromInput } from "../ComponentToBindFromInput";

type Props = ActionFormProps<Omit<ChangeVariableAction, "name">>;

export const ArrayVariableForm = ({ form, isPageAction }: Props) => {
  const methods: Array<{ label: string; value: ArrayMethods }> = [
    { label: "Replace all items", value: "REPLACE_ALL_ITEMS" },
    { label: "Update one item", value: "UPDATE_ONE_ITEM" },
    { label: "Insert at end", value: "INSERT_AT_END" },
    { label: "Insert at start", value: "INSERT_AT_START" },
    { label: "Insert at index", value: "INSERT_AT_INDEX" },
    { label: "Remove at index", value: "REMOVE_AT_INDEX" },
    { label: "Remove at start", value: "REMOVE_AT_START" },
    { label: "Remove at last", value: "REMOVE_AT_LAST" },
  ];

  const method = form.getInputProps("method");

  const showIndexField =
    method.value?.includes("INDEX") || method.value === "UPDATE_ONE_ITEM";

  return (
    <>
      <Select required label="Update array" data={methods} {...method} />
      {showIndexField && (
        <ComponentToBindFromInput
          required
          fieldType="number"
          label="Index"
          isPageAction={isPageAction}
          {...form.getInputProps("index")}
        />
      )}
    </>
  );
};

export const ChangeVariableActionForm = ({ form, isPageAction }: Props) => {
  const formValues = form.values;
  const fieldType = formValues.variableType;
  const defaultValue =
    fieldType === "ARRAY"
      ? !formValues.method || formValues.method === "REPLACE_ALL_ITEMS"
        ? "[]"
        : '""'
      : null;

  return (
    <Stack spacing="xs">
      <VariableSelect
        required
        {...form.getInputProps("variableId")}
        setVariableType={(type: FrontEndTypes) =>
          form.setValues({ variableType: type, method: "REPLACE_ALL_ITEMS" })
        }
      />
      {fieldType === "ARRAY" && (
        <ArrayVariableForm form={form} isPageAction={isPageAction} />
      )}

      <ComponentToBindFromInput
        required
        fieldType={fieldType?.toLowerCase() as FieldType}
        label="Value"
        isPageAction={isPageAction}
        defaultValue={defaultValue}
        {...form.getInputProps("value")}
      />
    </Stack>
  );
};
