import { listVariables } from "@/requests/variables/queries";
import { SetVariableAction } from "@/utils/actions";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { getPage } from "@/requests/pages/queries";
import { useEffect } from "react";
import { decodeSchema } from "@/utils/compression";
import { VariablesButton } from "@/components/variables/VariablesButton";

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

  const { data: variables } = useQuery({
    queryKey: ["variables", projectId, pageId],
    queryFn: async () => {
      const response = await listVariables(projectId);
      return response;
    },
    enabled: !!projectId && !!pageId,
  });

  const { data: page } = useQuery({
    queryKey: ["page", projectId, pageId],
    queryFn: async () => {
      const page = await getPage(projectId, pageId);
      return page;
    },
    enabled: !!projectId && !!pageId,
  });

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
            (variables?.results ?? []).find((v) => v.id === value),
          );
          form.setFieldValue("variable", variable);
        }}
        value={form.values.variable ? JSON.parse(form.values.variable).id : ""}
      />
      <ComponentToBindFromInput
        placeholder="value"
        label="Value"
        onPick={(componentToBindId: string) => {
          setPickingComponentToBindFrom(undefined);
          form.setFieldValue("value", `valueOf_${componentToBindId}`);
        }}
        {...form.getInputProps("value")}
      />
      <VariablesButton
        size="xs"
        mt="xs"
        pageId={pageId}
        projectId={projectId}
      />
      <Button
        type="submit"
        size="xs"
        loading={isUpdating}
        loaderPosition="center"
        disabled={isUpdating}
      >
        Save
      </Button>
    </Stack>
  );
};
