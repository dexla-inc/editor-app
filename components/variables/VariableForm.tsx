import { useVariable } from "@/hooks/reactQuery/useVariable";
import {
  FrontEndTypes,
  VariableTypesOptions,
} from "@/requests/variables/types";
import { useVariableStore } from "@/stores/variables";
import { safeJsonParse } from "@/utils/common";
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
import { Editor } from "@monaco-editor/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { SegmentedControlInput } from "../SegmentedControlInput";
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
        return JSON.stringify(defaultValue, null, 2);
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
  const variable = variableList.find((v) => v.id === variableId);
  const [selectedType, setSelectedType] = useState(variable?.type ?? "TEXT");
  const router = useRouter();
  const projectId = router.query.id as string;
  const { createVariablesMutation, updateVariablesMutation } =
    useVariable(projectId);

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
            size="sm"
            label="Default Value"
            {...form.getInputProps("defaultValue")}
          />
        );
      case "BOOLEAN":
        return (
          <SegmentedControlInput
            data={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
            ]}
            label="Default Value"
            {...form.getInputProps("defaultValue")}
          />
        );
      case "OBJECT":
      case "ARRAY":
        return (
          <Editor
            height="100px"
            defaultLanguage="json"
            {...(variableId
              ? {
                  value: form.values.defaultValue
                    ? safeJsonParse(form.values.defaultValue)
                    : "",
                  onChange: (value: any) => {
                    form.setFieldValue(
                      "defaultValue",
                      JSON.stringify(value, null, 2) ?? "",
                    );
                  },
                }
              : {
                  value: form.values.defaultValue,
                  onChange: (value: any) => {
                    form.setFieldValue("defaultValue", value ?? "");
                  },
                })}
            options={{
              wordWrap: "on",
              scrollBeyondLastLine: false,
              minimap: {
                enabled: false,
              },
            }}
          />
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
