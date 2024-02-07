import { useVariable } from "@/hooks/reactQuery/useVariable";
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
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

type VariablesFormValues = {
  name: string;
  type: FrontEndTypes;
  defaultValue: string;
  isGlobal: boolean;
};

type Props = {
  variableId?: string;
};

function convertDefaultValueToString(type: string, defaultValue: any): string {
  switch (type) {
    case "TEXT":
    case "NUMBER":
    case "BOOLEAN":
      return String(defaultValue);
    case "OBJECT":
    case "ARRAY":
      try {
        return JSON.stringify(defaultValue);
      } catch (error) {
        console.error("Error converting defaultValue to string:", error);
        return "";
      }
    default:
      return defaultValue;
  }
}

export const VariableForm = ({ variableId }: Props) => {
  const variableList = useVariableStore((state) => state.variableList);
  const router = useRouter();
  const projectId = router.query.id as string;
  const { createVariablesMutation, updateVariablesMutation } =
    useVariable(projectId);

  const variable = variableList.find((v) => v.id === variableId);

  const form = useForm<VariablesFormValues>({
    initialValues: {
      name: "",
      type: "TEXT",
      defaultValue: "",
      isGlobal: false,
    },
    validate: {
      name: requiredFieldValidator("Name"),
      type: requiredFieldValidator("Type"),
    },
  });

  const onSubmit = async (values: VariablesFormValues) => {
    const convertedValues = {
      ...values,
      defaultValue: convertDefaultValueToString(
        values.type,
        values.defaultValue,
      ),
    };

    // Use convertedValues instead of directly using values for mutation
    if (variableId) {
      updateVariablesMutation.mutate({
        id: variableId,
        values: convertedValues,
      });
    } else {
      createVariablesMutation.mutate(convertedValues);
    }
  };

  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedType, setSelectedType] = useState("TEXT");

  const handleTypeChange = (type: FrontEndTypes) => {
    setSelectedType(type);
    form.setFieldValue("type", type);
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
            size="sm"
            label="Default Value"
            {...form.getInputProps("defaultValue")}
          />
        );
      case "BOOLEAN":
        return (
          <SegmentedControlYesNo
            label="Default Value"
            {...form.getInputProps("defaultValue")}
          />
        );
      case "OBJECT":
      case "ARRAY":
        return (
          <Textarea
            autosize
            size="sm"
            label="Default Value"
            {...form.getInputProps("defaultValue")}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (variable && !isInitialized) {
      form.setValues({
        name: variable.name,
        type: variable.type,
        defaultValue: variable.defaultValue ?? "",
        isGlobal: variable.isGlobal,
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
          loading={createVariablesMutation.isLoading}
          compact
        >
          {variableId ? "Save" : "Create"} Variable
        </Button>
      </Stack>
    </form>
  );
};
