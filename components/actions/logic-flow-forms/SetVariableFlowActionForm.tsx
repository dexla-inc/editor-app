import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { VariablesButton } from "@/components/variables/VariablesButton";
import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { SetVariableAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<SetVariableAction, "name">;

export const SetVariableFlowActionForm = ({ form }: Props) => {
  const router = useRouter();
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const { setPickingComponentToBindFrom, setTree } = useEditorStore();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const { page, variables } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        label="Variable"
        data={(variables?.results ?? []).map((variable) => {
          return {
            value: variable.id,
            label: variable.name,
          };
        })}
        {...form.getInputProps("variable")}
        onChange={(value) => {
          const variable = JSON.stringify(
            (variables?.results ?? []).find((v) => v.id === value)
          );
          form.setFieldValue("variable", variable);
        }}
        value={form.values.variable ? JSON.parse(form.values.variable).id : ""}
      />
      <ComponentToBindFromInput
        placeholder="value"
        label="Value"
        onPickComponent={(componentToBindId: string) => {
          setPickingComponentToBindFrom(undefined);
          form.setValues({
            ...form.values,
            value: `valueOf_${componentToBindId}`,
          });
        }}
        onPickVariable={(variable: string) => {
          form.setValues({
            ...form.values,
            value: variable,
          });
        }}
        {...form.getInputProps("value")}
      />
      <VariablesButton
        size="xs"
        mt="xs"
        pageId={pageId}
        projectId={projectId}
      />
      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
