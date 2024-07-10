import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { BindingField } from "@/components/editor/BindingField/BindingField";
import { VariableSelect } from "@/components/variables/VariableSelect";
import { FrontEndTypes } from "@/requests/variables/types";
import { ActionFormProps, ChangeVariableAction } from "@/utils/actions";
import { ArrayMethods } from "@/types/types";
import { Select, Stack } from "@mantine/core";
import { FieldType } from "@/types/dataBinding";

type Props = ActionFormProps<Omit<ChangeVariableAction, "name">>;

const valueFieldTypeMapper = (variableType: string) => {
  const map = {
    NUMBER: "Number",
    BOOLEAN: "YesNo",
    OBJECT: "TextArea",
    ARRAY: "TextArea",
  };

  return map[variableType] ?? "Text";
};

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
    { label: "Toggle item", value: "TOGGLE_ITEM" },
  ];

  const method = form.getInputProps("method");

  const showIndexField =
    method.value?.includes("INDEX") || method.value === "UPDATE_ONE_ITEM";

  return (
    <>
      <Select required label="Update array" data={methods} {...method} />
      {showIndexField && (
        <BindingField
          fieldType="Text"
          required
          type="number"
          label="Index"
          isPageAction={isPageAction}
          {...form.getInputProps("index")}
        />
      )}
      {method.value === "UPDATE_ONE_ITEM" && (
        <>
          <SegmentedControlYesNo
            label="Partial Update"
            {...form.getInputProps("partialUpdate")}
          />
          {form.values.partialUpdate && (
            <BindingField
              fieldType="Text"
              required
              label="Path"
              isPageAction={isPageAction}
              {...form.getInputProps("path")}
            />
          )}
        </>
      )}
    </>
  );
};

export const ChangeVariableActionForm = ({ form, isPageAction }: Props) => {
  const { variableType, method } = form.values;
  const defaultValue =
    variableType === "ARRAY"
      ? method === "REPLACE_ALL_ITEMS" || !method
        ? "[]"
        : '""'
      : null;
  const hideInputField = method?.includes("REMOVE");
  const valueFieldType = valueFieldTypeMapper(variableType);

  return (
    <Stack spacing="xs">
      <VariableSelect
        required
        {...form.getInputProps("variableId")}
        setVariableType={(type: FrontEndTypes) =>
          form.setValues({ variableType: type, method: "REPLACE_ALL_ITEMS" })
        }
      />
      {variableType === "ARRAY" && (
        <ArrayVariableForm form={form} isPageAction={isPageAction} />
      )}
      {variableType === "OBJECT" && (
        <SegmentedControlYesNo
          label="Partial Update"
          {...form.getInputProps("partialUpdate")}
        />
      )}
      {form.values.partialUpdate && (
        <BindingField
          fieldType="Text"
          required
          label="Path"
          isPageAction={isPageAction}
          {...form.getInputProps("path")}
        />
      )}

      {!hideInputField && (
        <BindingField
          required
          fieldType={valueFieldType}
          type={variableType?.toLowerCase()}
          label="Value"
          isPageAction={isPageAction}
          defaultValue={defaultValue}
          {...form.getInputProps("value")}
        />
      )}
    </Stack>
  );
};
