import { MonacoEditorJson } from "@/components/MonacoEditorJson";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { useVariableMutation } from "@/hooks/editor/reactQuery/useVariable";
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
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { TopLabel } from "../TopLabel";
import { safeJsonStringify, toSnakeCase } from "@/utils/common";
import { Prism } from "@mantine/prism";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

type VariablesFormValues = {
  name: string;
  type: FrontEndTypes;
  defaultValue: string;
  value?: string;
  isGlobal: boolean;
};

type Props = {
  variableId?: string;
};

export const VariableForm = ({ variableId }: Props) => {
  const variableList = useVariableStore((state) =>
    Object.values(state.variableList),
  );
  const setVariable = useVariableStore((state) => state.setVariable);
  const variable = variableList.find((v) => v.id === variableId);
  const [selectedType, setSelectedType] = useState(variable?.type ?? "TEXT");
  const { id: projectId } = useEditorParams();
  const { createVariablesMutation, updateVariablesMutation } =
    useVariableMutation(projectId);

  const form = useForm<VariablesFormValues>({
    initialValues: {
      name: variable?.name ?? "",
      type: variable?.type ?? "TEXT",
      defaultValue: variable?.defaultValue ?? "",
      value: variable?.value,
      isGlobal: variable?.isGlobal ?? false,
    },
    validate: {
      name: requiredFieldValidator("Name"),
      type: requiredFieldValidator("Type"),
    },
  });

  const onSubmit = async (values: VariablesFormValues) => {
    if (variableId) {
      const name = toSnakeCase(values.name);
      updateVariablesMutation.mutate({
        id: variableId,
        values: { ...omit(values, ["value"]), name },
      });
      setVariable({ ...values, id: variableId, name });
    } else {
      createVariablesMutation.mutate({ ...values });
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
          <Text size="xs" mb={2} color="dimmed">
            If a variable is global, the value will not change when navigating
            between pages or refreshing your app. Also, when logging out the
            value is reset.
          </Text>
          <Text size="xs" mb={2} color="dimmed">
            If a variable is not global (default), the value will be reset when
            navigating between pages or refreshing your app.
          </Text>
        </Group>
        <Stack spacing={2}>
          <TopLabel text="Current Value" size="sm" />
          <ScrollArea mah={400}>
            <Prism
              language="json"
              colorScheme="dark"
              w="100%"
              copyLabel="Copy to clipboard"
              copiedLabel="Copied to clipboard"
              mah={400}
              sx={{ copy: { paddingTop: "20px" } }}
            >
              {typeof form.values.value === "string"
                ? safeJsonStringify(form.values.value)
                : String(form.values.value)}
            </Prism>
          </ScrollArea>
        </Stack>

        <Button
          type="submit"
          loading={
            createVariablesMutation.isPending ||
            updateVariablesMutation.isPending
          }
          compact
        >
          {variableId ? "Save" : "Create"} Variable
        </Button>
      </Stack>
    </form>
  );
};
