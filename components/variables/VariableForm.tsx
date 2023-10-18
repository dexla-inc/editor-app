import { createVariable } from "@/requests/variables/mutations";
import { getVariable } from "@/requests/variables/queries";
import { VariableTypesOptions } from "@/requests/variables/types";
import {
  Button,
  Checkbox,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type VariablesFormValues = {
  name: string;
  type: string;
  defaultValue: string;
  isGlobal: boolean;
};

type Props = {
  projectId: string;
  pageId: string;
  variableId?: string;
};

export const VariableForm = ({ projectId, pageId, variableId }: Props) => {
  const client = useQueryClient();

  const { data: variable } = useQuery({
    queryKey: ["variable", variableId],
    queryFn: async () => {
      const response = await getVariable(projectId, variableId!);
      return response;
    },
    enabled: !!variableId,
  });

  const createVariablesMutation = useMutation({
    mutationKey: ["variables", projectId, pageId],
    mutationFn: async (values: any) => {
      const response = await createVariable(projectId, {
        ...values,
        pageId,
      });
      return response;
    },
    onSettled: () => {
      client.refetchQueries(["variables", projectId, pageId]);
    },
  });

  const form = useForm<VariablesFormValues>({
    initialValues: {
      name: "",
      type: "",
      defaultValue: "",
      isGlobal: false,
    },
  });

  const onSubmit = async (values: VariablesFormValues) => {
    try {
      createVariablesMutation.mutate({
        ...values,
        pageId,
      });
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    if (variable && form.values.name === "") {
      form.setValues({
        name: variable.name,
        type: variable.type,
        defaultValue: variable.defaultValue,
        isGlobal: variable.isGlobal,
      });
    }
  }, [form, variable]);

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
        <Checkbox
          size="sm"
          label="Is Global?"
          {...form.getInputProps("isGlobal", { type: "checkbox" })}
        />

        <Button type="submit" loading={createVariablesMutation.isLoading}>
          {variableId ? "Save" : "Create"} Variable
        </Button>
      </Stack>
    </form>
  );
};
