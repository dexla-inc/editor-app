import { OutputForm } from "@/components/logic-flow/OutputForm";
import { CustomNode, NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { useFlowStore } from "@/stores/flow";
import { useVariableStore } from "@/stores/variables";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconArrowFork } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { NodeProps } from "reactflow";
import { safeJsonParse } from "@/utils/common";

type FormValues = {
  value?: string;
  variable?: string;
};

type ConditionalNodeData = NodeData & FormValues;

export const ConditionalNode = (node: NodeProps<ConditionalNodeData>) => {
  return <CustomNode {...node} avatar={NodeAvatar} />;
};

export const data: ConditionalNodeData = {
  label: "Conditional",
  description: "Execute actions conditionally",
  inputs: [{ id: nanoid(), name: "Input" }],
  outputs: [{ id: nanoid(), name: "First Condition" }],
};

export const NodeAvatar = (props: any) => {
  return <IconArrowFork {...props} />;
};

type NodeFormType = {
  form: UseFormReturnType<FormValues>;
};

export const NodeForm = ({ form }: NodeFormType) => {
  const selectedNode = useFlowStore((state) => state.selectedNode);
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const variableList = useVariableStore((state) =>
    Object.values(state.variableList),
  );

  return (
    <Stack>
      <Select
        size="xs"
        label="Variable"
        placeholder="Pick one"
        data={(variableList ?? []).map((variable) => {
          return {
            value: variable.id,
            label: variable.name,
          };
        })}
        {...form.getInputProps("variable")}
        onChange={(value) => {
          const variable = JSON.stringify(
            variableList.find((v) => v.id === value),
          );
          form.setFieldValue("variable", variable);
        }}
        value={
          form.values.variable ? safeJsonParse(form.values.variable).id : ""
        }
      />
      <OutputForm form={form as any} node={selectedNode!} />
      <Button
        type="submit"
        size="xs"
        loading={isUpdating}
        loaderPosition="center"
      >
        Save
      </Button>
    </Stack>
  );
};
