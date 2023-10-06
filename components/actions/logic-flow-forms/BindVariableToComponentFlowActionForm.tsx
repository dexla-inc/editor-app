import { ComponentToBindInput } from "@/components/ComponentToBindInput";
import { VariablePicker } from "@/components/VariablePicker";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { BindVariableToComponentAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Button, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<BindVariableToComponentAction, "name">;

export const BindVariableToComponentFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const { setPickingComponentToBindTo, setComponentToBind, setTree } =
    useEditorStore();

  const {
    variableProp: { data: variable, isLoading, refetch },
    page,
  } = useRequestProp(form.values.variable);

  useEffect(() => {
    if (form?.values?.variable && form?.values?.variableType === "OBJECT") {
      refetch();
    }
  }, [form?.values, refetch]);

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return (
    <Stack spacing="xs">
      <ComponentToBindInput
        onPick={(componentToBind: string) => {
          form.setFieldValue("component", componentToBind);

          setPickingComponentToBindTo(undefined);
          setComponentToBind(undefined);
        }}
        {...form.getInputProps("component")}
      />

      <TextInput
        size="xs"
        placeholder="Select a variable"
        label="Variable"
        {...form.getInputProps("variable")}
        rightSection={
          <VariablePicker
            onSelectValue={(selected) => {
              form.setFieldValue("variable", selected);
            }}
          />
        }
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
