import { CustomNode, NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { actionMapper, actions } from "@/utils/actions";
import { Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconBolt } from "@tabler/icons-react";
import startCase from "lodash.startcase";
import { nanoid } from "nanoid";
import { NodeProps } from "reactflow";

type FormValues = {
  value?: string;
  action?: string;
};

type ActionNodeData = NodeData & FormValues;

export const ActionNode = (node: NodeProps<ActionNodeData>) => {
  return <CustomNode {...node} avatar={NodeAvatar} />;
};

export const data: ActionNodeData = {
  label: "Action",
  description: "Execute an action",
  inputs: [{ id: nanoid(), name: "Input" }],
  outputs: [{ id: nanoid(), name: "Output" }],
};

export const NodeAvatar = (props: any) => {
  return <IconBolt {...props} />;
};

type NodeFormType = {
  form: UseFormReturnType<FormValues>;
};

export const NodeForm = ({ form }: NodeFormType) => {
  const actionMapped = form.values?.action
    ? // @ts-ignore
      actionMapper(form.values.action)
    : null;

  const ActionForm = actionMapped?.form;

  return (
    <Stack>
      <Select
        size="xs"
        placeholder="Select an action"
        label="Action"
        data={actions.map((action) => {
          return {
            label: startCase(action.name),
            value: action.name,
            group: action.group,
          };
        })}
        {...form.getInputProps("action")}
      />
      {ActionForm && <ActionForm form={form} />}
    </Stack>
  );
};
