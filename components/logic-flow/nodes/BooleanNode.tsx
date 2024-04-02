import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { CustomNode, NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { ValueProps } from "@/types/dataBinding";
import { UseFormReturnType } from "@mantine/form";
import { IconArrowFork } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { NodeProps } from "reactflow";
export * from "@/components/logic-flow/nodes/compute/actionNode";

type FormValues = {
  condition?: ValueProps;
};

type BooleanNodeData = NodeData & FormValues;

export const BooleanNode = (node: NodeProps<BooleanNodeData>) => {
  return <CustomNode {...node} avatar={NodeAvatar} />;
};

export const data: BooleanNodeData = {
  label: "True/False Split",
  description: "Execute True/False Action",
  inputs: [{ id: nanoid(), name: "Input" }],
  outputs: [{ id: nanoid(), name: "True/False Split" }],
};

export const NodeAvatar = (props: any) => {
  return <IconArrowFork {...props} />;
};

type NodeFormType = {
  form: UseFormReturnType<FormValues>;
};

export const NodeForm = ({ form }: NodeFormType) => {
  return (
    <ComponentToBindFromInput
      label="Condition"
      fieldType="boolean"
      useTrueOrFalseStrings
      {...form.getInputProps("condition")}
    />
  );
};
