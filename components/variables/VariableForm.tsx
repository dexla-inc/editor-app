import { MonacoEditorJson } from "@/components/MonacoEditorJson";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { useVariableMutation } from "@/hooks/reactQuery/useVariable";
import {
  FrontEndTypes,
  VariableTypesOptions,
} from "@/requests/variables/types";
import { useVariableStore } from "@/stores/variables";
import { requiredFieldValidator } from "@/utils/validation";
import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useState } from "react";
import { TopLabel } from "../TopLabel";

type VariablesFormValues = {
  name: string;
  type: FrontEndTypes;
  defaultValue: string;
  isGlobal: boolean;
};

type Props = {
  variableId?: string;
};

export const VariableForm = ({ variableId }: Props) => {
  const variableList = useVariableStore((state) => state.variableList);
  const setVariable = useVariableStore((state) => state.setVariable);
  const variable = variableList.find((v) => v.id === variableId);
  const [selectedType, setSelectedType] = useState(variable?.type ?? "TEXT");
  const router = useRouter();
  const projectId = router.query.id as string;
  const { createVariablesMutation, updateVariablesMutation } =
    useVariableMutation(projectId);

  const form = useForm<VariablesFormValues>({
    initialValues: {
      name: variable?.name ?? "",
      type: variable?.type ?? "TEXT",
      defaultValue: variable?.defaultValue ?? "",
      isGlobal: variable?.isGlobal ?? false,
    },
    validate: {
      name: requiredFieldValidator("Name"),
      type: requiredFieldValidator("Type"),
    },
  });

  const onSubmit = async (values: VariablesFormValues) => {
    if (variableId) {
      updateVariablesMutation.mutate({
        id: variableId,
        values: values,
      });
      setVariable({ ...values, id: variableId });
    } else {
      createVariablesMutation.mutate(values);
    }
  };

  const handleTypeChange = (type: FrontEndTypes) => {
    setSelectedType(type);
    form.setFieldValue("type", type);
    // Set defaultValue appropriately for defaultValue when type changes
    switch (type) {
      case "TEXT":
      case "NUMBER":
        form.setFieldValue("defaultValue", "");
        break;
      case "BOOLEAN":
        form.setFieldValue("defaultValue", "false");
        break;
      case "OBJECT":
        form.setFieldValue("defaultValue", "{}");
        break;
      case "ARRAY":
        form.setFieldValue("defaultValue", "[]");
        break;
      default:
        break;
    }
  };

  const DefaultValueInput = () => {
    switch (selectedType) {
      case "TEXT":
        return (
          <TextInput
            size="sm"
            label="Default Value"
            {...form.getInputProps("defaultValue")}
          />
        );
      case "NUMBER":
        return (
          <NumberInput
            label="Default Value"
            size="sm"
            {...form.getInputProps("defaultValue")}
          />
        );
      case "BOOLEAN":
        return (
          <SegmentedControlInput
            label="Default Value"
            data={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
            ]}
            {...form.getInputProps("defaultValue")}
          />
        );
      case "OBJECT":
      case "ARRAY":
        return (
          <Stack>
            <TopLabel text="Default Value" size="sm" />
            <MonacoEditorJson
              value={form.values.defaultValue}
              onChange={(value: any) => {
                form.setFieldValue("defaultValue", value ?? "");
              }}
            />
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput size="sm" label="Name" {...form.getInputProps("name")} />
        <Select
          size="sm"
          label="Type"
          data={VariableTypesOptions}
          withinPortal
          value={selectedType}
          onChange={handleTypeChange}
          disabled={!!variableId}
        />
        {DefaultValueInput()}
        <Group align="end">
          <SegmentedControlYesNo
            label="Is Global"
            {...form.getInputProps("isGlobal")}
            w={100}
          />
          <Text size="xs" mb={2} color="dimmed" maw={270}>
            If a variable is global, the value will not change when navigating
            between pages.
          </Text>
        </Group>
        <Button
          type="submit"
          loading={
            createVariablesMutation.isLoading ||
            updateVariablesMutation.isLoading
          }
          compact
        >
          {variableId ? "Save" : "Create"} Variable
        </Button>
      </Stack>
    </form>
  );
};
