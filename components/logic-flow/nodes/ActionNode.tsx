import { NodeProps } from "reactflow";
import { CustomNode, NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { IconBolt } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import { Select, Stack } from "@mantine/core";
import { actionMapper, actions } from "@/utils/actions";
import startCase from "lodash.startcase";
export * from "@/components/logic-flow/nodes/compute/actionNode";

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
  data: ActionNodeData;
};

export const NodeForm = ({ form, data }: NodeFormType) => {
  useEffect(() => {
    if (!form.values.action && !form.isTouched("action")) {
      form.setFieldValue("action", data.form?.action);
    }
  }, [data, form]);

  const actionMapped = form.values?.action
    ? // @ts-ignore
      actionMapper[form.values.action]
    : null;

  const ActionForm = actionMapped?.flowForm;

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
