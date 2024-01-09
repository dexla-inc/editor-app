import { useVariable } from "@/hooks/useVariable";
import { getVariable } from "@/requests/variables/queries-noauth";
import { VariableTypesOptions } from "@/requests/variables/types";
import { Button, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type VariablesFormValues = {
  name: string;
  type: string;
  defaultValue: string;
};

type Props = {
  projectId: string;
  variableId?: string;
};

const requiredFieldValidator = (fieldName: string) => (value: string) => {
  if (!value) {
    return `${fieldName} is required`;
  }
  return null;
};

export const VariableForm = ({ projectId, variableId }: Props) => {
  const { data: variable } = useQuery({
    queryKey: ["variable", variableId],
    queryFn: async () => getVariable(projectId, variableId!),
    enabled: !!variableId,
  });

  const { createVariablesMutation, updateVariablesMutation } = useVariable();

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
