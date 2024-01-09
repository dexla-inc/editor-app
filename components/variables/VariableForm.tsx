import { useVariable } from "@/hooks/useVariable";
import { VariableTypesOptions } from "@/requests/variables/types";
import { useVariableStore } from "@/stores/variables";
import { Button, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

type VariablesFormValues = {
  name: string;
  type: string;
  defaultValue: string;
};

type Props = {
  variableId?: string;
};

const requiredFieldValidator = (fieldName: string) => (value: string) => {
  if (!value) {
    return `${fieldName} is required`;
  }
  return null;
};

export const VariableForm = ({ variableId }: Props) => {
  const variableList = useVariableStore((state) => state.variableList);
  const { createVariablesMutation, updateVariablesMutation } = useVariable();

  const variable = variableList.find((v) => v.id === variableId);

  const form = useForm<VariablesFormValues>({
    initialValues: {
      name: "",
      type: "",
      defaultValue: "",
    },
    validate: {
      name: requiredFieldValidator("Name"),
      type: requiredFieldValidator("Type"),
    },
  });

  const onSubmit = async (values: VariablesFormValues) => {
    if (variableId) {
      updateVariablesMutation.mutate({ id: variableId, values });
    }
    createVariablesMutation.mutate({
      ...values,
    });
  };

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (variable && !isInitialized) {
      form.setValues({
        name: variable.name,
        type: variable.type,
        defaultValue: variable.defaultValue ?? "",
      });
      setIsInitialized(true);
    }
  }, [form, variable, isInitialized]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput size="sm" label="Name" {...form.getInputProps("name")} />
        <Select
          size="sm"
          label="Type"
          data={VariableTypesOptions}
          withinPortal
          {...form.getInputProps("type")}
        />
        <Textarea
          autosize
          size="sm"
          label="Default Value"
          {...form.getInputProps("defaultValue")}
        />
        <Button
          type="submit"
          loading={createVariablesMutation.isLoading}
          compact
        >
          {variableId ? "Save" : "Create"} Variable
        </Button>
      </Stack>
    </form>
  );
};
