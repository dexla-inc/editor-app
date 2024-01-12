import { OutputForm } from "@/components/logic-flow/OutputForm";
import { CustomNode, NodeData } from "@/components/logic-flow/nodes/CustomNode";
import { useVariableListQuery } from "@/hooks/reactQuery/useVariableListQuery";
import { useFlowStore } from "@/stores/flow";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconArrowFork } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NodeProps } from "reactflow";

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
  data: ConditionalNodeData;
};

export const NodeForm = ({ form, data }: NodeFormType) => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const selectedNode = useFlowStore((state) => state.selectedNode);
  const isUpdating = useFlowStore((state) => state.isUpdating);

  const { data: variables } = useVariableListQuery(projectId);

  useEffect(() => {
    if (!form.values.variable && !form.isTouched("variable")) {
      form.setFieldValue("variable", data.form?.variable);
    }
  }, [data, form]);

  return (
    <Stack>
      <Select
        size="xs"
        label="Variable"
        placeholder="Pick one"
        data={(variables?.results ?? []).map((variable) => {
          return {
            value: variable.id,
            label: variable.name,
          };
        })}
        {...form.getInputProps("variable")}
        onChange={(value) => {
          const variable = JSON.stringify(
            (variables?.results ?? []).find((v) => v.id === value),
          );
          form.setFieldValue("variable", variable);
        }}
        value={form.values.variable ? JSON.parse(form.values.variable).id : ""}
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
